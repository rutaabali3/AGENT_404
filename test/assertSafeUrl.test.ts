import test from 'node:test'
import assert from 'node:assert/strict'
import { assertSafeUrl } from '../src/agent/tools.js'

test('assertSafeUrl throws Invalid URL format for invalid URL strings', async () => {
  const invalidUrls = ['not-a-valid-url', 'http://', '://bad', '']

  for (const url of invalidUrls) {
    await assert.rejects(
      async () => {
        await assertSafeUrl(url)
      },
      {
        name: 'Error',
        message: 'Invalid URL format'
      }
    )
  }
})

test('assertSafeUrl throws error for disallowed protocols', async () => {
  const disallowedUrls = ['ftp://example.com', 'file:///etc/passwd', 'gopher://example.com', 'ws://example.com']

  for (const url of disallowedUrls) {
    await assert.rejects(
      async () => {
        await assertSafeUrl(url)
      },
      {
        name: 'Error',
        message: 'Only http and https protocols are allowed'
      }
    )
  }
})
