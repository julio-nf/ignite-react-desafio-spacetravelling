import Link from 'next/link';

import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={`${styles.headerContainer} ${commonStyles.container}`}>
      <Link href="/">
        <a>
          <img src="/images/logo.svg" alt="logo" />
          <p>
            spacetravelling
            <span>.</span>
          </p>
        </a>
      </Link>
    </header>
  );
}
