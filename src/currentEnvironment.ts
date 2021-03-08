/**
 * Determine which environment to load env files from
 */
export default function(): string {
  return process.env.NODE_ENV ?? process.env.ENVIRONMENT ?? 'default';
}
