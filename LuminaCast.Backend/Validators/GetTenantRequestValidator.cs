using FluentValidation;
using Corestream.Tenant;

namespace LuminaCast.Backend.Validators
{
    public class GetTenantRequestValidator : AbstractValidator<GetTenantRequest>
    {
        public GetTenantRequestValidator()
        {
            // ISO 27001 Annex A.14.2: Ensure all inputs are validated to prevent injection
            RuleFor(x => x.DomainOrId)
                .NotEmpty().WithMessage("Domain or ID cannot be empty.")
                .MaximumLength(100).WithMessage("Domain or ID cannot exceed 100 characters.")
                .Matches(@"^[a-zA-Z0-9.\-_]+$").WithMessage("Domain or ID contains invalid characters. Only alphanumeric characters, dots, hyphens, and underscores are allowed.");
        }
    }
}
