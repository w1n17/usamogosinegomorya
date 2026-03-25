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
    const { blobs } = await list();
    const calendarBlob = blobs.find((b) => b.pathname === BLOB_FILENAME);

    if (!calendarBlob) {
      // Если файла нет в Blob, возвращаем данные из локального файла проекта
      try {
        const initialData = {
          "rooms": [
            {
              "id": "room-1",
              "name": "Номер для новобрачных",
              "image": "/image/123/novobrachnie/05d62c2b27d4bff70b9cf1e26e32f994.jpg",
              "prices": {},
              "bookings": []
            },
            {
              "id": "room-2",
              "name": "Студия 'Эгоист'",
              "image": "/image/55/egoist/photo_5235967796057936580_y.jpg",
              "prices": {},
              "bookings": []
            },
            {
              "id": "room-3",
              "name": "Блаженство 2",
              "image": "/image/123/blaj/photo_5235967796057936467_y.jpg",
              "prices": {},
              "bookings": []
            },
            {
              "id": "room-4",
              "name": "Блаженство 3",
              "image": "/image/123/blaj3/photo_5235967796057936483_y.jpg",
              "prices": {},
              "bookings": []
            },
            {
              "id": "room-5",
              "name": "Блаженство 4",
              "image": "/image/123/blaj3/photo_5235967796057936479_y (1).jpg",
              "prices": {},
              "bookings": []
            },
            {
              "id": "room-6",
              "name": "Блаженство 5",
              "image": "/image/123/blaj4/photo_5235967796057936514_y.jpg",
              "prices": {},
              "bookings": []
            },
            {
              "id": "room-7",
              "name": "Блаженство 22",
              "image": "/image/55/blaj5/photo_5235967796057936454_y.jpg",
              "prices": {},
              "bookings": []
            },
            {
              "id": "room-8",
              "name": "Семейное блаженство",
              "image": "/image/55/sem_schastie/photo_5235967796057936603_y.jpg",
              "prices": {},
              "bookings": []
            },
            {
              "id": "room-9",
              "name": "Семейные просторы",
              "image": "/image/55/sem_prostori/photo_5235967796057936642_y.jpg",
              "prices": {},
              "bookings": []
            },
            {
              "id": "apartment",
              "name": "Квартира",
              "image": "/image/apartment/photo_5317054549518389867_y.jpg",
              "prices": {},
              "bookings": []
            }
          ],
          "lastUpdated": new Date().toISOString()
        };
        return NextResponse.json(initialData);
      } catch (e) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
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
