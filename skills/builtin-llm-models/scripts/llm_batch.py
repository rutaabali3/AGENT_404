#!/usr/bin/env python3
"""Concurrent, retrying batch LLM driver for the Manus built-in proxy (sandbox).

Reads inputs (one per line, or a JSON array), sends each to a chosen model with a
prompt template, and writes results to JSONL. Designed for bulk summarization,
translation, classification, extraction, or analysis.

Auth: uses OPENAI_API_KEY / OPENAI_API_BASE (preconfigured in the sandbox).
Always confirm the model id against the live catalog first:
    curl -s "$OPENAI_API_BASE/models" -H "Authorization: Bearer $OPENAI_API_KEY"

Examples
--------
# Summarize each line of a file with the cheap default model:
python3 llm_batch.py --input items.txt --out out.jsonl \
    --system "You are concise." \
    --template "Summarize in one sentence:\n{input}"

# Translate with reasoning off (default), 12 workers:
python3 llm_batch.py --input items.txt --out out.jsonl --workers 12 \
    --template "Translate to French:\n{input}"

# Structured extraction with a JSON schema file (strict):
python3 llm_batch.py --input items.txt --out out.jsonl --model gpt-5-mini \
    --schema schema.json --template "Extract fields from:\n{input}"

# Add thinking/reasoning (auto-detected by model family, or pass --reasoning-effort):
python3 llm_batch.py --input items.txt --out out.jsonl --model claude-sonnet-4-6 \
    --thinking-budget 2048 --template "Analyze deeply:\n{input}"
"""
import argparse
import concurrent.futures as cf
import json
import os
import sys
import time

try:
    from openai import OpenAI
except ImportError:
    sys.exit("openai package missing. Run: sudo pip3 install openai")


def load_inputs(path):
    raw = open(path, "r", encoding="utf-8").read()
    raw_stripped = raw.strip()
    if raw_stripped.startswith("["):
        try:
            arr = json.loads(raw_stripped)
            return [x if isinstance(x, str) else json.dumps(x, ensure_ascii=False) for x in arr]
        except json.JSONDecodeError:
            pass
    return [ln for ln in raw.splitlines() if ln.strip()]


def build_extra_body(model, thinking_budget, reasoning_effort):
    """Pick the right thinking/reasoning param shape for the model family.

    Gemini models reason by default and do not need explicit thinking params.
    The reasoning_effort flag is accepted for Gemini but is optional.
    """
    m = model.lower()
    if reasoning_effort:
        if m.startswith("gemini"):
            # Gemini: reasoning_effort is a top-level param, not extra_body.
            # Handled in make_request_kwargs instead.
            return None
        return {"reasoning": {"effort": reasoning_effort}}
    if thinking_budget:
        if m.startswith("gpt"):
            # gpt-5 family uses reasoning.effort; map a budget heuristically.
            effort = "low" if thinking_budget <= 1024 else "medium" if thinking_budget <= 4096 else "high"
            return {"reasoning": {"effort": effort}}
        if m.startswith("claude"):
            return {"thinking": {"type": "enabled", "budget_tokens": thinking_budget}}
        if m.startswith("gemini"):
            # Gemini reasons by default; thinking_budget is ignored.
            return None
    return None


def make_request_kwargs(args, schema):
    kwargs = {"model": args.model}
    m = args.model.lower()
    extra = build_extra_body(args.model, args.thinking_budget, args.reasoning_effort)
    if extra:
        kwargs["extra_body"] = extra
    # Gemini MUST use max_tokens (NOT max_completion_tokens) to avoid content: null.
    # For other families, max_completion_tokens is preferred when reasoning is on.
    if m.startswith("gemini"):
        kwargs["max_tokens"] = 16384
        if args.reasoning_effort:
            kwargs["reasoning_effort"] = args.reasoning_effort
    if schema is not None:
        kwargs["response_format"] = {
            "type": "json_schema",
            "json_schema": {"name": "output", "strict": True, "schema": schema},
        }
    return kwargs


def call_one(client, args, schema, idx, text):
    messages = []
    if args.system:
        messages.append({"role": "system", "content": args.system})
    messages.append({"role": "user", "content": args.template.replace("{input}", text)})
    kwargs = make_request_kwargs(args, schema)

    last_err = None
    for attempt in range(args.max_retries + 1):
        try:
            r = client.chat.completions.create(messages=messages, **kwargs)
            content = r.choices[0].message.content
            out = {"index": idx, "input": text, "output": content, "error": None}
            if r.usage:
                out["usage"] = {
                    "prompt_tokens": r.usage.prompt_tokens,
                    "completion_tokens": r.usage.completion_tokens,
                }
            return out
        except Exception as e:  # noqa: BLE001 - report and retry
            last_err = str(e)
            if attempt < args.max_retries:
                time.sleep(min(2 ** attempt, 20))
    return {"index": idx, "input": text, "output": None, "error": last_err}


def main():
    ap = argparse.ArgumentParser(description="Batch LLM driver for Manus built-in proxy.")
    ap.add_argument("--input", required=True, help="Input file: lines or a JSON array.")
    ap.add_argument("--out", required=True, help="Output JSONL path.")
    ap.add_argument("--model", default="gpt-5-mini", help="Model id (verify via /models).")
    ap.add_argument("--template", default="{input}", help="Prompt template; {input} is replaced.")
    ap.add_argument("--system", default="", help="Optional system prompt.")
    ap.add_argument("--schema", default="", help="Path to JSON schema for strict structured output.")
    ap.add_argument("--workers", type=int, default=8, help="Concurrent workers (4-10 recommended).")
    ap.add_argument("--thinking-budget", type=int, default=0, help="Thinking budget tokens (claude only; mapped to effort for gpt; ignored for gemini).")
    ap.add_argument("--reasoning-effort", default="", choices=["", "minimal", "low", "medium", "high"], help="Reasoning effort (gpt/gemini). Gemini reasons by default even without this.")
    ap.add_argument("--max-retries", type=int, default=3)
    args = ap.parse_args()

    schema = None
    if args.schema:
        schema = json.load(open(args.schema, "r", encoding="utf-8"))

    inputs = load_inputs(args.input)
    if not inputs:
        sys.exit("No inputs found.")
    client = OpenAI()

    results = [None] * len(inputs)
    done = 0
    with cf.ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(call_one, client, args, schema, i, t): i for i, t in enumerate(inputs)}
        for fut in cf.as_completed(futures):
            res = fut.result()
            results[res["index"]] = res
            done += 1
            if done % 10 == 0 or done == len(inputs):
                print(f"  {done}/{len(inputs)} done", file=sys.stderr)

    with open(args.out, "w", encoding="utf-8") as f:
        for res in results:
            f.write(json.dumps(res, ensure_ascii=False) + "\n")

    errors = sum(1 for r in results if r["error"])
    print(f"Wrote {len(results)} results to {args.out} ({errors} errors).", file=sys.stderr)
    if errors:
        print("Re-run failed items on a stronger model; see references/model_catalog.md.", file=sys.stderr)


if __name__ == "__main__":
    main()
