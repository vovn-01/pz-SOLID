import { IStorageService, INotificationService, IReportFormatter } from '../interfaces';

// Реалізації для DIP: Робота зі сховищем та сповіщеннями
export class CloudStorageService implements IStorageService {
    save(content: string): void {
        console.log("Saved to Cloud:", content);
    }
}

export class SlackNotificationService implements INotificationService {
    notify(message: string): void {
        console.log(`Slack Notification: ${message}`);
    }
}

// Реалізації для OCP: Можна додати CsvFormatter або XmlFormatter без зміни існуючого коду
export class PdfFormatter implements IReportFormatter {
    format(data: { title: string; content: string }): string {
        return `[PDF Document] ${data.title}\nBody: ${data.content}`;
    }
}

export class HtmlFormatter implements IReportFormatter {
    format(data: { title: string; content: string }): string {
        return `<html><body><h1>${data.title}</h1><p>${data.content}</p></body></html>`;
    }
}