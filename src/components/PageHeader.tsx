import PageTitle from './PageTitle';

type PageHeaderProps = {
  title?: string;
};

// The title, in the page's own flow at every width.
export default function PageHeader({ title }: PageHeaderProps) {
  return <PageTitle title={title} className="px-0 mb-2" />;
}
