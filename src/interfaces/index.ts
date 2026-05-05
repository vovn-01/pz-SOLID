// ISP: Специфічні інтерфейси замість одного гігантського
export interface IStorageService {
    save(content: string): void;
}

export interface INotificationService {
    notify(message: string): void;
}

// OCP: Абстракція для форматування звіту
export interface IReportFormatter {
    format(data: { title: string; content: string }): string;
}