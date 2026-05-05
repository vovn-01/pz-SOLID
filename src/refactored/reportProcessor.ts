import { IStorageService, INotificationService, IReportFormatter } from '../interfaces';

// LSP: Базовий абстрактний клас, який задає загальний контракт
export abstract class BaseReport {
    constructor(
        public title: string,
        public content: string,
        public formatter: IReportFormatter
    ) {}

    // Кожен тип звіту визначає свій спосіб дистрибуції без генерації помилок для несумісних дій
    abstract distribute(): string;
}

// LSP: Правильне наслідування
export class PhysicalReport extends BaseReport {
    distribute(): string {
        return "Sent to the physical printer queue.";
    }
}

export class DigitalReport extends BaseReport {
    distribute(): string {
        return "Secure download link generated.";
    }
}

// SRP: Цей клас відповідає виключно за оркестрацію процесу генерації звіту
// DIP: Клас залежить від абстракцій (IStorageService, INotificationService), а не від конкретних БД чи API
export class ReportManager {
    constructor(
        private storage: IStorageService,
        private notifier: INotificationService
    ) {}

    public processReport(report: BaseReport): void {
        if (!report.title || !report.content) {
            throw new Error("Invalid report data");
        }

        // 1. Форматування (делеговано форматеру)
        const formattedContent = report.formatter.format({
            title: report.title,
            content: report.content
        });

        // 2. Збереження (делеговано сховищу)
        this.storage.save(formattedContent);

        // 3. Дистрибуція специфічна для типу (поліморфізм)
        const distributionStatus = report.distribute();

        // 4. Сповіщення (делеговано сервісу нотифікацій)
        this.notifier.notify(`Report "${report.title}" processed. Status: ${distributionStatus}`);
    }
}