import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

/**
 * API роут для работы с календарем в Vercel Blob.
 * GET: Получает текущие данные календаря.
 * POST: Обновляет данные календаря (требует пароль).
 */

const BLOB_FILENAME = 'calendar-data.json';

export async function GET() {
  try {
    // Ищем файл в Blob
    const { blobs } = await list();
    const calendarBlob = blobs.find((b) => b.pathname === BLOB_FILENAME);

    if (!calendarBlob) {
      // Если файла нет, возвращаем пустую структуру (позже инициализируем)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const response = await fetch(calendarBlob.url);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, data } = body;

    // Простая проверка пароля через переменную окружения
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Удаляем старые версии файла перед записью нового (опционально для экономии места, 
    // но Blob поддерживает версионность через разные URL)
    const { blobs } = await list();
    const oldBlobs = blobs.filter((b) => b.pathname === BLOB_FILENAME);
    for (const b of oldBlobs) {
      await del(b.url);
    }

    // Записываем новый файл
    // Используем access: 'public' для Put, так как это влияет только на URL, 
    // но сам Blob-контейнер может быть настроен как Private в Vercel.
    const { url } = await put(BLOB_FILENAME, JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false, // Чтобы имя файла было фиксированным
    });

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Error updating calendar:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
