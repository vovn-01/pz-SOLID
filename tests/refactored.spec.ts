import { ReportManager, PhysicalReport, DigitalReport } from '../src/refactored/reportProcessor';
import { HtmlFormatter, PdfFormatter } from '../src/refactored/services';
import { IStorageService, INotificationService } from '../src/interfaces';

describe('ReportManager (SOLID Refactored)', () => {
    let mockStorage: IStorageService;
    let mockNotifier: INotificationService;
    let reportManager: ReportManager;

    beforeEach(() => {
        // DIP: Ін'єкція залежностей за допомогою мок-об'єктів для тестування
        mockStorage = { save: jest.fn() };
        mockNotifier = { notify: jest.fn() };
        reportManager = new ReportManager(mockStorage, mockNotifier);
    });

    it('should process a physical HTML report correctly', () => {
        const formatter = new HtmlFormatter();
        const report = new PhysicalReport('Q1 Results', 'Profit increased.', formatter);

        reportManager.processReport(report);

        expect(mockStorage.save).toHaveBeenCalledWith(expect.stringContaining('<h1>Q1 Results</h1>'));
        expect(mockNotifier.notify).toHaveBeenCalledWith(
            expect.stringContaining('Sent to the physical printer queue.')
        );
    });

    it('should process a digital PDF report correctly (LSP compliance)', () => {
        const formatter = new PdfFormatter();
        const report = new DigitalReport('Tax 2023', 'Financial details...', formatter);

        reportManager.processReport(report);

        expect(mockStorage.save).toHaveBeenCalledWith(expect.stringContaining('[PDF Document] Tax 2023'));
        expect(mockNotifier.notify).toHaveBeenCalledWith(
            expect.stringContaining('Secure download link generated.')
        );
    });

    it('should throw an error if report data is missing', () => {
        const report = new DigitalReport('', '', new PdfFormatter());
        expect(() => reportManager.processReport(report)).toThrow('Invalid report data');
    });
});