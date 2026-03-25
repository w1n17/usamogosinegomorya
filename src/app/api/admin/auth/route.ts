import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * API роут для проверки пароля администратора
 * POST: Проверяет пароль и возвращает success/error
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Пароль не указан' }, { status: 400 });
    }

    // Проверяем пароль через переменную окружения
    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Неверный пароль' }, { status: 401 });
  } catch (error) {
    console.error('[AUTH] Error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка сервера' }, { status: 500 });
  }
}
