import { getAllergenes, getInvites, getPageData } from "@/utils/getter";
import { notFound } from "next/navigation";
import { PageData } from "@/types/api";
import { NavigationProps } from "@/types/pages";
import SectionRenderer from "@/utils/renderComponent"
import DefaultPage from "@/components/Page/DefaultPage";

export default async function RepondrePage() {
  const props = await getPageData('reponses')
  console.log('Pages data dans reponses/page.tsx :', props)
  const page: PageData = props?.pageProps;
  console.log('Page data dans reponses/page.tsx :', page)
  const invites = await getInvites();
  const nav = props?.navProps;
  console.log('Navigation props dans reponses/page.tsx :', nav)
  const navMenu: NavigationProps = {current: "reponses", ...nav}
  console.log('Navigation menu dans reponses/page.tsx :', navMenu)

  const allergenes = await getAllergenes();
  if (!invites || !allergenes) return notFound();
  
  return (
    <DefaultPage navMenu={navMenu}>
      {page?.Section?.map((element, index) => {
        
        return element.__typename === 'ComponentSectionFormInvite' ? (
          <SectionRenderer
            key={index}
            section={element}
            navMenu={navMenu}
            invites={invites}
            allergenes={allergenes}
          />
        ) : (
          <SectionRenderer
            key={index}
            section={element}
            navMenu={navMenu}
          />
        );
      })}
    </DefaultPage>
  );
}
