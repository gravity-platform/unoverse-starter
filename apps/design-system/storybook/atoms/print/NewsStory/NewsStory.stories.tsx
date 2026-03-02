import type { Meta, StoryObj } from "@storybook/react";
import NewsStory from "./NewsStory";

const meta: Meta<typeof NewsStory> = {
  title: "Print/Atoms/NewsStory",
  component: NewsStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "featured"],
    },
    columns: {
      control: "select",
      options: [1, 2, 3],
    },
    theme: {
      control: "select",
      options: ["dark", "light"],
    },
    layoutHint: {
      control: "select",
      options: ["hero", "sidebar", "bottom"],
    },
    photoAspect: {
      control: "select",
      options: ["landscape", "portrait", "square"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NewsStory>;

const sampleBody =
  'A Bay Area pharmaceutical distribution firm has filed a mandatory report with the FDA after a routine quarterly audit revealed a discrepancy in its controlled compound inventory, sources familiar with the matter confirmed Friday. The firm, which declined to be identified pending the investigation, said the missing substances — classified as Schedule IV compounds — were unaccounted for across a period spanning July through mid-September.\n\nNo arrests have been made. Federal investigators say the probe is in its early stages. The compounds in question are commonly used as sedatives and muscle relaxants. While not considered high-risk narcotics, Schedule IV substances are subject to strict federal tracking requirements.\n\nIndustry analysts noted that inventory discrepancies of this nature, while rare, are not unheard of in large distribution networks. "It could be a clerical error, a software glitch, or something more deliberate," said Dr. Ramesh Gupta, a pharmaceutical compliance consultant based in San Francisco.';

/* ─── STANDARD VARIANT ─── */

export const SingleColumn: Story = {
  args: {
    variant: "standard",
    columns: 1,
    headline: "Bay Area Pharma Firm Reports Inventory Discrepancy",
    subheadline: "FDA notified after quarterly audit flags missing controlled compounds",
    byline: "By Tom Hargrove",
    body: sampleBody,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "240px", fontFamily: "Georgia, serif" }}>
        <Story />
      </div>
    ),
  ],
};

export const TwoColumns: Story = {
  args: {
    variant: "standard",
    columns: 2,
    headline: "Silverado Trail Bridge Reopens After Three-Year Restoration",
    subheadline: "Historic 1927 stone span restored with original materials; community celebrates",
    byline: "By Linda Park",
    body: sampleBody,
    hasPhoto: true,
    photoCaption: "The restored Silverado Trail Bridge, originally built in 1927.",
    photoAspect: "landscape",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "480px", fontFamily: "Georgia, serif" }}>
        <Story />
      </div>
    ),
  ],
};

export const ThreeColumnHero: Story = {
  args: {
    variant: "standard",
    columns: 3,
    layoutHint: "hero",
    headline: "Estate Manager Found Dead At Annual Harvest Gala",
    subheadline:
      "Police investigating suspicious circumstances at the Blackwell family vineyard; guests detained for questioning late into the night",
    byline: "By Sarah Connolly",
    body: sampleBody + "\n\n" + sampleBody,
    hasPhoto: true,
    photoCaption: "Emergency vehicles line the entrance to the Blackwell Estate on Silverado Trail.",
    photoAspect: "landscape",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "720px", fontFamily: "Georgia, serif" }}>
        <Story />
      </div>
    ),
  ],
};

/* ─── FEATURED VARIANT ─── */

export const FeaturedDark: Story = {
  args: {
    variant: "featured",
    theme: "dark",
    label: "BREAKING",
    headline: "Sheriff Issues Statement On Estate Death",
    body: "Cass County investigators have requested all gala attendees remain available for follow-up interviews in the coming days. A forensic perimeter has been established around the estate wine cellar. The medical examiner's office expects to release preliminary findings within 48 to 72 hours. The estate remains closed to visitors until further notice.",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "240px" }}>
        <Story />
      </div>
    ),
  ],
};

export const FeaturedLight: Story = {
  args: {
    variant: "featured",
    theme: "light",
    label: "LOCAL NEWS",
    headline: "Harvest Festival Postponed Following Estate Tragedy",
    body: 'Organizers of the annual downtown Cass Valley harvest parade announced Sunday that the event will be postponed indefinitely out of respect for the Blackwell family. "Our community is grieving," said parade chair Diane Russo. A revised date is expected later this month.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: "480px" }}>
        <Story />
      </div>
    ),
  ],
};
