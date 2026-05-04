using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using LuminaCast.Backend.Infrastructure;
using LuminaCast.Backend.Services;
using LuminaCast.Backend.Validators;
using Serilog;
using Calzolari.Grpc.AspNetCore.Validation;

// Bootstrap Serilog for ISO 27001 Audit Logging
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/audit-.txt", rollingInterval: RollingInterval.Day)
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting LuminaCast Backend server...");
    
    var builder = WebApplication.CreateBuilder(args);

    // Replace default .NET logging with Serilog
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File("logs/audit-.txt", rollingInterval: RollingInterval.Day));

    // Add services to the container.
    builder.Services.AddGrpc(options =>
    {
        // Add FluentValidation Interceptor to gRPC pipeline
        options.EnableMessageValidation();
    });

    // Add REST Controllers for Webhooks
    builder.Services.AddControllers();

    // Register Validators
    builder.Services.AddGrpcValidation();
    builder.Services.AddValidator<GetTenantRequestValidator>();

    // Setup EF Core with SQLite (Modular approach)
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

    builder.Services.AddScoped<ITenantRepository, TenantRepository>();
    builder.Services.AddScoped<IVideoDeliveryService, VideoDeliveryService>();

    // ISO 27001 Annex A.9: Access Control via JWT
    builder.Services.AddAuthentication("Bearer")
        .AddJwtBearer("Bearer", options =>
        {
            options.Authority = builder.Configuration["Clerk:Authority"];
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateAudience = false, // Clerk tokens sometimes don't have strict audience unless configured
            };
        });
    builder.Services.AddAuthorization();

    // Configure Stripe Global API Key
    Stripe.StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

    var app = builder.Build();

    // Enable Serilog Request Logging
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "Handled {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    });

    app.UseAuthentication();
    app.UseAuthorization();

    // Configure the HTTP request pipeline.
    app.MapControllers();
    app.MapGrpcService<TenantService>();

    app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client.");

    // Automatic Migration & Seeding on Startup
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<AppDbContext>();
        
        context.Database.EnsureCreated();

        var repo = services.GetRequiredService<ITenantRepository>();
        await repo.SeedMockDataAsync();
    }

    app.Run();
}
catch (System.Exception ex)
{
    Log.Fatal(ex, "LuminaCast Backend terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

