import { Check, Shield, Sparkles } from "lucide-react";
import { Button } from "../Button";

/**
 * ProductDetails - SAB Premium Design
 * On-brand with SAB red, premium card showcase
 */
export function ProductDetails({ product, onApplyClick, showButton = true }) {
  if (!product) return null;

  const {
    title,
    name,
    description,
    tier,
    imageUrl,
    image,
    metadata = {},
    keyBenefits = [],
    positioning,
    annualFee,
    annualFeeNotes,
    network,
    uiTags = [],
    family,
  } = product;

  const displayTitle = title || name || "Product";
  const displayDescription = description || positioning || metadata?.shortDescription || "";
  const heroImage = imageUrl || image || metadata?.images?.[0];
  const displayTier = tier || "PREMIUM";
  const benefits = keyBenefits.length > 0 ? keyBenefits.slice(0, 4) : [];
  const tags = uiTags.length > 0 ? uiTags.slice(0, 5) : [];

  // Format annual fee display
  const feeDisplay = annualFee === 0 || annualFee === null || annualFee === undefined ? "Free" : `SAR ${annualFee}`;
  const feeLabel = annualFee === 0 || annualFee === null || annualFee === undefined ? "for life" : "/year";

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* SAB Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <img
            src="https://www.sab.com/content/dam/sabpws/common/logo/SAB-Logo.svg"
            alt="SAB"
            className="h-8"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span
            className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
            style={{ background: "linear-gradient(135deg, #d33131 0%, #b82a2a 100%)", color: "white" }}
          >
            {displayTier}
          </span>
        </div>

        {/* Card Showcase */}
        {heroImage && (
          <div className="px-6 py-4 flex justify-center">
            <div className="relative max-w-[280px]">
              {/* Glow effect */}
              <div
                className="absolute inset-0 blur-2xl opacity-30 rounded-3xl"
                style={{ background: "linear-gradient(135deg, #d33131 0%, #b82a2a 100%)" }}
              />
              {/* Card image with shadow */}
              <img
                src={heroImage}
                alt={displayTitle}
                className="relative w-full h-auto rounded-xl shadow-xl"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="px-6 py-3">
          <div className="flex items-center justify-center gap-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{feeDisplay}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{annualFeeNotes || feeLabel}</div>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{network || "VISA"}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Network</div>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="px-6 pt-4 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{displayTitle}</h1>
          {displayDescription && (
            <p className="text-[15px] text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">{displayDescription}</p>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Benefits - Compact Premium Style */}
        {benefits.length > 0 && (
          <div className="px-6 pb-5">
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Benefits</h3>
            <div className="space-y-1.5">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-[13px] text-gray-600 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
              Subject to credit approval. Terms and conditions apply. Your application will be reviewed within 24-48
              hours.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      {showButton && (
        <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <Button variant="primary" size="lg" fullWidth onClick={onApplyClick}>
            <Sparkles className="w-5 h-5 mr-2" />
            Apply Now
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
