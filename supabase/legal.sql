-- Legal pages CMS (privacy policy + terms of service): append-only versions + RLS
-- Run once in the Supabase SQL editor (or re-run; policies are replaced).
--
-- Every save inserts a NEW row with an incremented version. Exactly one row per
-- slug has is_current = true and that is what the public pages read.
-- Rows are never updated in place and never deleted, so the history doubles as
-- the audit trail (who edited, when, and why).

create table if not exists public.legal_documents (
  id bigint generated always as identity primary key,
  slug text not null check (slug in ('privacy', 'terms')),
  title text not null,
  body jsonb not null,
  version integer not null check (version > 0),
  change_summary text not null,
  edited_by uuid references auth.users (id) on delete set null,
  edited_by_email text not null,
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  unique (slug, version)
);

-- Only one published row per document.
create unique index if not exists legal_documents_one_current_idx
  on public.legal_documents (slug)
  where is_current;

create index if not exists legal_documents_history_idx
  on public.legal_documents (slug, version desc);

alter table public.legal_documents enable row level security;

drop policy if exists "Public can view current legal documents" on public.legal_documents;
create policy "Public can view current legal documents"
  on public.legal_documents
  for select
  to anon, authenticated
  using (is_current = true);

drop policy if exists "Authenticated can view legal history" on public.legal_documents;
create policy "Authenticated can view legal history"
  on public.legal_documents
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can publish legal documents" on public.legal_documents;
create policy "Authenticated can publish legal documents"
  on public.legal_documents
  for insert
  to authenticated
  with check (true);

-- Update exists only so a publish can flip the previous row's is_current to false.
drop policy if exists "Authenticated can retire legal documents" on public.legal_documents;
create policy "Authenticated can retire legal documents"
  on public.legal_documents
  for update
  to authenticated
  using (true)
  with check (true);

-- No delete policy: history is append-only.

grant select on table public.legal_documents to anon, authenticated;
grant insert, update on table public.legal_documents to authenticated;

-- Seed version 1 placeholders (Tiptap / ProseMirror JSON).
insert into public.legal_documents (
  slug,
  title,
  body,
  version,
  change_summary,
  edited_by_email,
  is_current
)
select *
from (
  values
    (
      'privacy',
      'Privacy Policy',
      $privacy${
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "marks": [{ "type": "italic" }],
                "text": "Placeholder content. This document has not been reviewed by a lawyer. Replace it with wording that reflects how the shop actually handles customer information before relying on it."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "1. Who We Are" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Onyx Hand Premium Wash operates this website. In this policy, \"we\", \"us\", and \"our\" refer to Onyx Hand Premium Wash. This policy explains what personal information we collect through this website, how we use it, and the choices you have."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "2. Information We Collect" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "We only collect information you choose to give us. When you submit our contact form, we receive:"
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [{ "type": "text", "text": "Your name" }]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [{ "type": "text", "text": "Your email address" }]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [{ "type": "text", "text": "Your phone number, if you provide one" }]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [{ "type": "text", "text": "The message you write to us" }]
                  }
                ]
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "We do not ask visitors to create an account, and we do not collect or store payment card details on this website."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "3. How We Use Your Information" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "We use the details you send us to reply to your enquiry, answer questions about our services, and arrange a visit to the shop. We do not sell your information, and we do not add you to a marketing list without your permission."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "4. Third-Party Services We Use" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Running this website means a small number of trusted providers may process data on our behalf:"
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      { "type": "text", "marks": [{ "type": "bold" }], "text": "Resend" },
                      { "type": "text", "text": " delivers contact form messages to our inbox." }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      { "type": "text", "marks": [{ "type": "bold" }], "text": "Supabase" },
                      { "type": "text", "text": " stores the website content we publish, such as services, hours, and gallery photos." }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      { "type": "text", "marks": [{ "type": "bold" }], "text": "Google Maps" },
                      { "type": "text", "text": " powers the map showing our location. Google may collect data when the map loads." }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      { "type": "text", "marks": [{ "type": "bold" }], "text": "Our hosting provider" },
                      { "type": "text", "text": " keeps standard server logs, which can include IP addresses." }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "5. Cookies and Analytics" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "This website does not use advertising cookies or third-party tracking. Cookies are used only where they are needed for the site to work, such as keeping a shop administrator signed in. If we add analytics later, we will update this section first."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "6. How Long We Keep Your Information" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Contact form messages stay in our email inbox for as long as we need them to answer your enquiry and keep a record of the work discussed. You can ask us to delete them sooner."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "7. Your Privacy Rights" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it. Email us using the address below and we will respond within a reasonable time."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "8. Children's Privacy" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "This website is intended for adults arranging vehicle care. We do not knowingly collect personal information from children."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "9. Changes to This Policy" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "We may update this policy as our services change. The version number and date shown at the top of this page always reflect the current published version."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "10. Contact Us" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Questions about this policy or about your information can be sent through our contact page, or to the shop email address listed in the footer."
              }
            ]
          }
        ]
      }$privacy$::jsonb,
      1,
      'Initial placeholder content',
      'system@seed',
      true
    ),
    (
      'terms',
      'Terms of Service',
      $terms${
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "marks": [{ "type": "italic" }],
                "text": "Placeholder content. This document has not been reviewed by a lawyer. The liability and vehicle condition sections in particular should be checked before you rely on them."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "1. About This Website" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "This website is published by Onyx Hand Premium Wash to share information about our services, prices, opening hours, and location. By browsing the site or contacting us through it, you agree to these terms."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "2. Services, Pricing, and Hours" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "We keep the service list, prices, and hours on this site as accurate as we can, but they may change without notice. Prices shown are a guide: the final price can depend on the size of your vehicle and its condition on arrival. Sending us a message does not create a confirmed booking until we reply and agree on a time."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "3. Service Acceptance and Refusal" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "We may decline or stop a service where the vehicle is unsafe to work on, where existing damage makes cleaning risky, or where a request falls outside what we offer. If that happens we will tell you before any work begins."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "4. Vehicle Condition" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Hand washing is gentler than automated equipment, but it cannot reverse pre-existing damage such as clear coat failure, deep scratches, rust, or loose trim. Please point out any known damage or loose parts before we start, and remove valuables from the vehicle."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "5. Acceptable Use" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Please use this website lawfully. Do not send abusive or fraudulent messages through the contact form, attempt to disrupt the site, or copy its content in bulk by automated means."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "6. Intellectual Property" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "The Onyx name and logo, the text on this site, and the photographs in our gallery belong to Onyx Hand Premium Wash. Please ask before reusing them."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "7. Third-Party Links" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "This site links to services we do not control, such as Google Maps and our social media profiles. We are not responsible for their content or their privacy practices."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "8. Disclaimer" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "The information on this website is provided as is, without warranty. We are not liable for loss arising from reliance on website information that has since changed. Nothing here limits any rights you have under consumer protection law."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "9. Governing Law" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "These terms are governed by the laws of the province and country in which the shop operates."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "10. Changes to These Terms" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "We may update these terms from time to time. The version number and date at the top of this page show the currently published version, and continuing to use the site means you accept it."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [{ "type": "text", "text": "11. Contact Us" }]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "If anything here is unclear, reach us through the contact page or the shop email address in the footer."
              }
            ]
          }
        ]
      }$terms$::jsonb,
      1,
      'Initial placeholder content',
      'system@seed',
      true
    )
) as seed(slug, title, body, version, change_summary, edited_by_email, is_current)
where not exists (select 1 from public.legal_documents);
