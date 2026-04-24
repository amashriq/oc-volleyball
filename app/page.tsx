import PageHero from "./components/PageHero";

export default function HomePage() {
  return (
    <main>
      <PageHero src='/images/hero/hero1.JPG' alt='OC Volleyball Action' contentPosition='top'>
        <h1 className='page-heading'>
          OUTTA
          <br />
          CONTROL
          <br />
          VOLLEYBALL
        </h1>
      </PageHero>
    </main>
  );
}
