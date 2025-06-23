import { NextResponse } from 'next/server';

export async function GET() {
  const huyaGitlabToken = process.env.HUYA_GITLAB_TOKEN || '';
  return NextResponse.json({ accessToken: huyaGitlabToken });
}
