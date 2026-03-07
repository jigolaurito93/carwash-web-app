type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Do I need an appointment?",
    answer:
      "Walk-ins are welcome, but we recommend scheduling an appointment to ensure minimal wait times and guaranteed availability.",
  },
  {
    question: "How long does a typical wash take?",
    answer:
      "Most hand washes take between 20–40 minutes depending on the service level and current queue.",
  },
  {
    question: "What makes a hand wash better than an automatic wash?",
    answer:
      "Hand washing is gentler on your paint, reduces the risk of scratches from hard brushes, and allows us to focus on details machines often miss.",
  },
  {
    question: "Do you offer interior detailing?",
    answer:
      "Yes, we offer a range of interior services including vacuuming, interior wipe-down, and deep detailing packages.",
  },
];

type FAQProps = {
  title?: string;
  items?: FAQItem[];
};

const FAQ = ({
  title = "Frequently Asked Questions",
  items = faqs,
}: FAQProps) => {
  return (
    <section className="w-full bg-black/90 px-6 py-12 text-white sm:px-10 lg:px-24 lg:py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="text-center">
          <h2 className="font-lexend text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-3 font-questrial text-sm text-white/80 sm:text-base lg:text-lg">
            Find quick answers to the questions our guests ask most often.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-white/10 bg-black/60 p-4 transition-colors duration-200 hover:border-yellow-400/70 sm:p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="font-lexend text-sm font-semibold sm:text-base lg:text-lg">
                  {item.question}
                </span>
                <span className="shrink-0 rounded-full border border-white/20 bg-white/5 px-2 py-1 font-lexend text-xs text-white/80 transition-transform duration-200 group-open:rotate-90">
                  +
                </span>
              </summary>
              <p className="mt-3 font-questrial text-sm text-white/80 sm:text-base lg:text-lg">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
