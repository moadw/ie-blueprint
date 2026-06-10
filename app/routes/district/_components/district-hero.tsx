import districtHeroDefault from "~/assets/district-hero-default.jpg";
import type { UserDistrictFindOneQuery } from "~/gql/graphql";

export interface DistrictHeroProps {
  district: UserDistrictFindOneQuery["UserDistrictFindOne"] | null;
}

export function DistrictHero({ district }: DistrictHeroProps) {
  const name = district?.name ?? "District Portal";
  const coverSrc = district?.coverPhoto?.url ?? districtHeroDefault;
  const logoUrl = district?.logo?.url;

  return (
    <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-muted">
      <img src={coverSrc} alt={name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-6 right-6 flex items-center gap-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            className="h-12 w-12 rounded-[12px] object-cover shrink-0"
          />
        ) : null}
        <h1 className="text-white font-serif text-3xl leading-tight tracking-wide uppercase text-right">
          {name}
        </h1>
      </div>
    </div>
  );
}

export default DistrictHero;
