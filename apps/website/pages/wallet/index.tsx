/* eslint-disable react/no-unescaped-entities */
import {
  ContentGallery,
  Callout,
  SiteHeading,
  webLinks,
} from '@siafoundation/design-system'
import { Layout } from '../../components/Layout'
import { routes } from '../../config/routes'
import { minutesInSeconds } from '@siafoundation/units'
import { getFeedContent } from '../../content/feed'
import { AsyncReturnType } from '../../lib/types'
import { getProjects } from '../../content/projects'
import { getStats } from '../../content/stats'
import { getWalletArticles } from '../../content/articles'
import { SectionGradient } from '../../components/SectionGradient'
import { backgrounds, patterns, previews } from '../../content/assets'
import { SectionTransparent } from '../../components/SectionTransparent'
import { SectionProjects } from '../../components/SectionProjects'
import { SectionTutorials } from '../../components/SectionTutorials'
import { CalloutWalletd } from '../../components/CalloutWalletd'
import { SoftwareSectionSiaUI } from '../../components/SoftwareSectionCurrentGen'
import {
  getWalletdLatestDaemonRelease,
  getWalletdLatestDesktopRelease,
} from '../../content/releases'
import { DownloadSection } from '../../components/DownloadSection'

const title = 'Wallet'
const description = 'Manage your wallet on the Sia network.'

type Props = AsyncReturnType<typeof getStaticProps>['props']

export default function Wallet({
  technical,
  tutorials,
  projects,
  releaseDaemon,
  releaseDesktop,
}: Props) {
  return (
    <Layout
      title={title}
      description={description}
      path={routes.wallet.index}
      heading={
        <SectionTransparent className="pt-24 md:pt-32 pb-0">
          <SiteHeading
            anchorLink={false}
            size="64"
            title={title}
            description={description}
          />
        </SectionTransparent>
      }
      backgroundImage={backgrounds.jungle}
      previewImage={previews.jungle}
    >
      <SectionGradient className="pb-20">
        <DownloadSection
          daemon="walletd"
          releaseDaemon={releaseDaemon}
          releaseDesktop={releaseDesktop}
          statusDesktop="beta"
        />
        <div className="flex flex-col">
          <SiteHeading
            size="32"
            title="Core Software"
            description="Official software, developed by the Sia Foundation."
            className="mt-12 md:mt-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CalloutWalletd />
            <Callout
              title="Setup guide for walletd"
              background={patterns.nateSnow}
              description={
                <>
                  Learn how to create a Sia wallet and send and receive bigfile
                  with walletd.
                </>
              }
              actionTitle="Follow the walletd setup guide"
              actionLink={webLinks.docs.wallet}
              actionNewTab
            />
            <SoftwareSectionSiaUI />
          </div>
          <SiteHeading
            size="32"
            title="Third-party Software"
            description="Third-party software and services, developed by the community."
            className="mt-12 md:mt-24"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionProjects items={projects} />
          </div>
        </div>
      </SectionGradient>
      <SectionGradient className="pt-12 pb-20">
        <SiteHeading
          id="guides"
          size="32"
          className="pt-0 md:pt-24 pb-10 md:pb-20"
          title="Learn how Sia wallets work"
          description={<>Tutorials on how to use a Sia wallet.</>}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionTutorials items={tutorials} />
        </div>
        <SiteHeading
          size="32"
          className="pt-32 md:pt-60 pb-10 md:pb-20"
          title="Learn about the technology behind Sia"
          description={
            <>
              Technical deep-dives from the core team and the ecosystem of
              developers building technology on top of Sia.
            </>
          }
        />
        <ContentGallery columnClassName="grid-cols-1" items={technical} />
        <Callout
          title="Sia 101"
          className="mt-20 md:mt-40 mb-10 md:mb-24"
          size="2"
          background={previews.bamboo}
          description={
            <>
              Learn how the Sia protocol works to power redundant,
              decentralized, data storage.
            </>
          }
          actionTitle="Learn how Sia works"
          actionLink={routes.learn.index}
        />
      </SectionGradient>
    </Layout>
  )
}

export async function getStaticProps() {
  const [stats, technical, tutorials, projects, releaseDaemon, releaseDesktop] =
    await Promise.all([
      getStats(),
      getFeedContent(['technical'], 8),
      getWalletArticles(),
      getProjects('wallet'),
      getWalletdLatestDaemonRelease(),
      getWalletdLatestDesktopRelease(),
    ])

  const props = {
    technical,
    tutorials,
    projects,
    releaseDaemon,
    releaseDesktop,
    fallback: {
      '/api/stats': stats,
    },
  }

  return {
    props,
    revalidate: minutesInSeconds(5),
  }
}
