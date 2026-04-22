// src/app/services/course.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Интерфейс для Категории
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Интерфейс для Курса
export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  teacher?: { id: number; username: string; email?: string; first_name?: string; last_name?: string };
  is_enrolled?: boolean; // Статус записи для текущего юзера
}

// Интерфейс для Записи (Enrollment)
export interface Enrollment {
  id: number;
  enrolled_at: string;
  student: { id: number; username: string; /* ... */ };
  course: Course;
}

// Тип для данных при обновлении курса
type CourseUpdateData = Partial<{
  title: string;
  description: string;
  category_id: number | null;
}>;


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Базовый URL API

  constructor(private http: HttpClient) { }

  /**
   * Получает список всех курсов.
   */
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/`);
  }

  /**
   * Получает детали одного курса по его ID.
   * @param id - ID курса
   */
  getCourse(id: number | string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}/`);
  }

  /**
   * Записывает текущего пользователя на курс.
   * @param courseId - ID курса для записи
   */
  enroll(courseId: number): Observable<any> {
   return this.http.post(`${this.apiUrl}/enrollments/`, { course_id: courseId });
  }

  /**
   * Отписывает текущего пользователя от курса.
   * @param courseId - ID курса для отписки
   */
  unenroll(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}/unenroll/`);
  }

  /**
   * Получает список категорий.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  /**
   * Добавляет новый курс.
   * @param courseData - Данные нового курса
   */
  addCourse(courseData: { title: string; description: string; category_id: number | null }): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses/`, courseData);
  }

  /**
   * Получает список записей (enrollments) для текущего залогиненного пользователя.
   */
  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments/`);
  }

  // --- НОВЫЙ МЕТОД ДЛЯ ОБНОВЛЕНИЯ КУРСА ---
  /**
   * Обновляет существующий курс.
   * @param courseId ID курса для обновления
   * @param courseData Данные для обновления (могут быть частичными, если использовать PATCH)
   */
  updateCourse(courseId: number | string, courseData: CourseUpdateData): Observable<Course> {
    // Используем PUT (требует все поля) или PATCH (частичное обновление)
    return this.http.put<Course>(`${this.apiUrl}/courses/${courseId}/`, courseData);
    // или return this.http.patch<Course>(`${this.apiUrl}/courses/${courseId}/`, courseData);
  }
  // ------------------------------------

  // --- НОВЫЙ МЕТОД ДЛЯ УДАЛЕНИЯ КУРСА ---
  /**
   * Удаляет курс.
   * @param courseId ID курса для удаления
   */
  deleteCourse(courseId: number | string): Observable<any> {
    // Отправляем DELETE запрос
    return this.http.delete(`${this.apiUrl}/courses/${courseId}/`);
  }
  // -----------------------------------

}