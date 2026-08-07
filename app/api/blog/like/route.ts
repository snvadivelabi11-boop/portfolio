import { NextResponse } from 'next/server';
import { blogPosts } from '@/data/blogs';

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    post.likes += 1;
    return NextResponse.json({ success: true, likes: post.likes });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
