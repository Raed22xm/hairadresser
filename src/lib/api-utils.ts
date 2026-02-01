import { ZodError, type ZodType } from 'zod'
import { NextResponse } from 'next/server'

type ParseSuccess<T> = { success: true; data: T }
type ParseFailure = { success: false; response: NextResponse }

export function parseBody<T>(
  schema: ZodType<T>,
  body: unknown
): ParseSuccess<T> | ParseFailure {
  try {
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Validation failed', details },
          { status: 400 }
        ),
      }
    }
    throw error
  }
}
