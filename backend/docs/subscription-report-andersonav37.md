# Subscription & Payment Report — andersonav37@gmail.com

Generated: 2026-05-09

---

## User

| Field | Value                  |
| ----- | ---------------------- |
| ID    | 2                      |
| Name  | Anderson Arévalo       |
| Email | andersonav37@gmail.com |

---

## Subscription

| Field                | Value                                  |
| -------------------- | -------------------------------------- |
| Subscription ID      | 1                                      |
| Status               | ✅ **active**                          |
| Plan                 | Aptis Pro                              |
| Billing Cycle        | monthly                                |
| Started At           | 2026-05-09 14:42:33                    |
| Current Period Start | 2026-05-09 14:42:33                    |
| Current Period End   | 2026-06-09 14:42:33                    |
| Cancel at Period End | No                                     |
| Canceled At          | —                                      |
| Idempotency Key      | `bfd8fa81-9bca-49fa-90a8-23ddc67cc8ae` |

---

## Plan

| Field            | Value                                          |
| ---------------- | ---------------------------------------------- |
| Plan ID          | 18                                             |
| Name             | Aptis Pro                                      |
| Description      | Full access to exams, courses, and evaluations |
| Speaking Reviews | 5                                              |
| Writing Reviews  | 5                                              |
| Classes          | 0                                              |

### Pricing

| Field           | Value      |
| --------------- | ---------- |
| Plan Price ID   | 4          |
| Billing Cycle   | monthly    |
| Currency        | EUR        |
| Base Price      | €22.00     |
| Discount        | 0%         |
| **Final Price** | **€22.00** |
| Active          | Yes        |

---

## Payment (Stripe)

| Field              | Value                         |
| ------------------ | ----------------------------- |
| Stripe Customer ID | `cus_UUAPwnniTRh9TB`          |
| Payment Intent ID  | `pi_3TVC5MEUWixuTNFf0C2NDgHs` |
| Payment Method ID  | `pm_1TVC5LEUWixuTNFfrgJnEgl9` |
| Amount Charged     | €22.00 (2200 cents)           |
| Currency           | EUR                           |
| Status             | succeeded                     |
| Mode               | Test                          |

---

## Package (Access Grant)

| Field                   | Value                         |
| ----------------------- | ----------------------------- |
| Package ID              | 1                             |
| Is Active               | Yes                           |
| Expiration Date         | 2026-06-08                    |
| Speaking Credits        | 5                             |
| Writing Credits         | 5                             |
| Class Credits           | 0                             |
| Total Charged           | €22.00                        |
| Stripe Charge Reference | `pi_3TVC5MEUWixuTNFf0C2NDgHs` |
| Created At              | 2026-05-09 14:42:33           |
