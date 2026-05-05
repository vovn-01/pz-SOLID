// Порушення ISP: Інтерфейс вимагає реалізації методів, які потрібні не всім
export interface IReportTasks {
    generatePDF(): void;
    generateHTML(): void;
    printOnPaper(): void;
}

// Порушення DIP: Клас вищого рівня жорстко залежить від конкретних реалізацій
class LocalDiskStorage {
    saveFile(content: string) { console.log("Saved to disk: ", content); }
}

class SmtpEmailService {
    sendEmail(msg: string) { console.log(`Email sent: ${msg}`); }
}

// Порушення SRP: Клас обробляє валідацію, бізнес-логіку вибору формату, збереження та сповіщення.
export class BadReportProcessor implements IReportTasks {
    private storage = new LocalDiskStorage();
    private email = new SmtpEmailService();

    public processAndSave(data: any, formatType: string) {
        // Валідація
        if (!data || !data.title) {
            throw new Error("Invalid report data");
        }

        // Порушення OCP: Додавання нового формату (наприклад, CSV) вимагає зміни цього методу
        let formattedContent = "";
        if (formatType === "pdf") {
            formattedContent = `[PDF] ${data.title}: ${data.content}`;
        } else if (formatType === "html") {
            formattedContent = `<h1>${data.title}</h1><p>${data.content}</p>`;
        } else {
            throw new Error("Unknown format");
        }

        this.storage.saveFile(formattedContent);
        this.email.sendEmail(`Your report ${data.title} is ready.`);
    }

    public generatePDF(): void { console.log("PDF logic..."); }
    public generateHTML(): void { console.log("HTML logic..."); }
    public printOnPaper(): void { console.log("Printing physically..."); }
}

// Порушення LSP: Нащадок ламає очікувану поведінку базового класу, викидаючи помилку там, де очікується дія
export class WebOnlyReportProcessor extends BadReportProcessor {
    public printOnPaper(): void {
        throw new Error("Web reports cannot be printed on physical paper!");
    }
}