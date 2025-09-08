namespace ShopForHome.Services
{
    public class EmailService
    {
        public Task SendEmailAsync(string to, string subject, string html) 
        {
            // Implement email sending (SMTP, SendGrid etc.) in production.
            Console.WriteLine($"[EmailService] To={to} Subject={subject}");
            return Task.CompletedTask;
        }
    }
}
