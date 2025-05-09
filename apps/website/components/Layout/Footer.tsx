import {
  ClientSideOnly,
  Link,
  Logo,
  SiteMap,
  ThemeRadio,
  webLinks,
} from '@siafoundation/design-system'
import { menuSections } from '../../config/siteMap'
import { Statsbar } from '../Statsbar'
import { SectionTransparent } from '../SectionTransparent'
import { SectionSolid } from '../SectionSolid'
import { routes } from '../../config/routes'

export function Footer() {
  return (
    <div className="flex flex-col overflow-hidden">
      <SectionTransparent className="pt-10 pb-12 md:pt-14 md:pb-20">
        <SiteMap menuSections={menuSections} />
      </SectionTransparent>
      <SectionSolid className="py-10 md:py-12 border-t border-gray-100 dark:border-graydark-100">
        <Statsbar />
      </SectionSolid>
      <SectionSolid className="py-4 border-t border-gray-100 dark:border-graydark-100">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 items-center">
            <Logo size={20} />
            <Link
              size="12"
              color="contrast"
              weight="medium"
              underline="hover"
              href={routes.foundation.index}
              noWrap
            >
              The Sia Foundation © {new Date().getFullYear()}
            </Link>
          </div>
          <div className="flex-1 flex items-center gap-4">
            <Link
              href={routes.terms.index}
              size="12"
              color="subtle"
              underline="hover"
              noWrap
            >
              Terms of Service
            </Link>
            <Link
              href={routes.privacy.index}
              size="12"
              color="subtle"
              underline="hover"
              noWrap
            >
              Privacy Policy
            </Link>
            <Link
              href={`mailto:${webLinks.email}`}
              size="12"
              color="subtle"
              underline="hover"
              noWrap
            >
              {webLinks.email}
            </Link>
            <div className="flex-1" />
            <ClientSideOnly
              fallback={<div className="w-[80px] h-[16px]"></div>}
            >
              <ThemeRadio className="hidden md:flex" />
            </ClientSideOnly>
          </div>
        </div>
      </SectionSolid>
    </div>
  )
}
