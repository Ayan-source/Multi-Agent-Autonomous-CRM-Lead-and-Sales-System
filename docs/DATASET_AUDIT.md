# LeadsBlue CSV audit (D01)

**Status:** D01 file inspection complete. Dataset license remains unconfirmed from the [specific Kaggle dataset page](https://www.kaggle.com/datasets/leadsblue/b2b-contact-database-sample-dataset). Do not import or commit raw contact records until the permitted use is clear.

## Source and method

- Local file: `globalb2bdataset.csv` (kept outside Git because it contains names and email addresses).
- File size: 84,436 bytes; SHA-256: `F011AB66DDE54FD1E9F34D715CFAEF6A46CF616E027CCBFCD59131DF197D1068`.
- Read-only inspection used Python's built-in `csv.DictReader` on the whole file. The file decodes as Windows-1252, has a comma delimiter, one header row, and 763 data rows. No contact values were printed or copied into this report.
- The CSV itself has no license, consent, or provenance column. The accessible Kaggle page confirmed the dataset location, but its dynamic license and file-preview fields were not readable through this environment. The license of a related Kaggle notebook is **not** evidence for this dataset's license.

## Observed columns and quality

| CSV column | Nonblank / 763 | Distinct nonblank | Observation |
| --- | ---: | ---: | --- |
| `Decision Maker Name` | 763 | 763 | Personal name; use synthetic/anonymized values in demos. |
| `Decision Maker Title` | 763 | 763 | Free text; 3 values exceed 80 characters. |
| `Industry` | 665 | 665 | 98 blanks (12.8%); free text, with 21 values exceeding 80 characters. |
| `Email Address` | 763 | 763 | All pass a basic `local@domain.tld` shape check; this does not verify delivery or consent. |
| `Country` | 763 | 5 | United States 317, Australia 327, India 48, Canada 36, United Kingdom 35. |

There were no malformed CSV rows, exact duplicate rows, case-insensitive duplicate emails, or duplicate name-title-country combinations in this file. These checks do not prove that people or companies are unique in the real world. No company name, company size, domain, source ID, opt-in, or opt-out field exists. The Kaggle page title mentions company data, but the supplied file has no company column. The missing company and size attributes limit the ICP matching proposed in the project documents.

## Decision for later tasks

Use this file only for schema exploration until its license is confirmed. D02 now maps the five observed fields with synthetic fixtures, allows absent industry, and treats company/domain/size as unavailable rather than inventing them. Do not import these records or use them in a demo until the Kaggle dataset's exact **License** label is confirmed. Demo fixtures and any committed sample should be synthetic or anonymized.
