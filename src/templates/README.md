# Legal Document Templates

This directory contains locale-specific template files for legal documents. Each template can use placeholders that will be automatically replaced with country-specific information.

## Template Structure

### Serbia (RS) Templates
Located in `src/templates/rs/`
- Serbian-specific legal documents
- Uses Serbian company information and legal references
- Follows Serbian legal requirements

### European Union (EU) Templates  
Located in `src/templates/eu/`
- EU-specific legal documents
- Uses EU company information and GDPR compliance
- Follows EU legal requirements

## Available Placeholders

### Company Information
- `{{company.name}}` - Company name (e.g., "Dermotin")
- `{{company.legalName}}` - Legal company name (e.g., "Clicky Doo")
- `{{company.address}}` - Company address
- `{{company.city}}` - Company city
- `{{company.postalCode}}` - Company postal code
- `{{company.country}}` - Company country
- `{{company.taxNumber}}` - Tax number (PIB)
- `{{company.registrationNumber}}` - Registration number (MB)
- `{{company.activityCode}}` - Activity code
- `{{company.activityDescription}}` - Activity description
- `{{company.email}}` - Company email
- `{{company.phone}}` - Company phone
- `{{company.website}}` - Company website

### Business Information
- `{{business.deliveryArea}}` - Delivery area description
- `{{business.deliveryService}}` - Delivery service name
- `{{business.deliveryServiceName}}` - Full delivery service name
- `{{business.deliveryCost}}` - Delivery cost
- `{{business.deliveryCostCurrency}}` - Delivery cost currency
- `{{business.deliveryTimeMin}}` - Minimum delivery time
- `{{business.deliveryTimeMax}}` - Maximum delivery time
- `{{business.deliveryTimeUnit}}` - Delivery time unit (e.g., "radnih dana")
- `{{business.returnPeriodDays}}` - Return period in days
- `{{business.warrantyPeriodYears}}` - Warranty period in years
- `{{business.complaintResponseDays}}` - Complaint response time in days
- `{{business.complaintResolutionDays}}` - Complaint resolution time in days
- `{{business.technicalComplaintResolutionDays}}` - Technical complaint resolution time in days

### Legal Information
- `{{legal.lastUpdated}}` - Last updated date
- `{{legal.copyrightLaw}}` - Copyright law reference
- `{{legal.criminalCode}}` - Criminal code reference
- `{{legal.consumerProtectionLaw}}` - Consumer protection law reference
- `{{legal.dataProtectionLaw}}` - Data protection law reference
- `{{legal.obligationsLaw}}` - Obligations law reference
- `{{legal.ministryWebsite}}` - Ministry website URL
- `{{legal.disputeResolutionListUrl}}` - Dispute resolution list URL

### Fulfillment Center Information (for EU countries)
- `{{fulfillmentCenter.name}}` - Fulfillment center display name
- `{{fulfillmentCenter.legalName}}` - Legal name of fulfillment center
- `{{fulfillmentCenter.address}}` - Fulfillment center address
- `{{fulfillmentCenter.city}}` - Fulfillment center city
- `{{fulfillmentCenter.postalCode}}` - Postal code
- `{{fulfillmentCenter.country}}` - Country
- `{{fulfillmentCenter.phone}}` - Phone number
- `{{fulfillmentCenter.email}}` - Email address
- `{{fulfillmentCenter.website}}` - Website URL
- `{{fulfillmentCenter.dataProcessingAgreement}}` - Whether DPA is in place (true/false)
- `{{fulfillmentCenter.gdprCompliant}}` - Whether GDPR compliant (true/false)
- `{{fulfillmentCenter.dataRetentionPeriod}}` - Data retention period in days
- `{{fulfillmentCenter.dataProcessingPurpose}}` - Purpose of data processing
- `{{fulfillmentCenter.operatingHours}}` - Operating hours
- `{{fulfillmentCenter.privacyPolicyUrl}}` - Privacy policy URL
- `{{fulfillmentCenter.dataProtectionOfficer.name}}` - DPO name
- `{{fulfillmentCenter.dataProtectionOfficer.email}}` - DPO email
- `{{fulfillmentCenter.dataProtectionOfficer.phone}}` - DPO phone

### Dynamic Date
- `{{CURRENT_DATE}}` - Current date in local format

## How to Use

1. Copy your current legal document content into the appropriate locale template file
2. Replace static information with placeholders (e.g., replace "Dermotin" with `{{COMPANY_NAME}}`)
3. The template processor will automatically replace placeholders with country-specific data

## Template Files by Locale

### Serbia (RS) - `src/templates/rs/`
- `terms-of-service.txt` - Terms of Service template
- `privacy-policy.txt` - Privacy Policy template
- `cookie-policy.txt` - Cookie Policy template
- `returns-policy.txt` - Returns Policy template
- `disclaimer.txt` - Disclaimer template
- `contact-info.txt` - Contact Information template

### European Union (EU) - `src/templates/eu/`
- `terms-of-service.txt` - Terms of Service template (EU compliant)
- `privacy-policy.txt` - Privacy Policy template (GDPR compliant)
- `cookie-policy.txt` - Cookie Policy template (GDPR compliant)
- `returns-policy.txt` - Returns Policy template (EU consumer rights)
- `shipping-policy.txt` - Shipping Policy template
- `disclaimer.txt` - Disclaimer template
- `contact-info.txt` - Contact Information template
