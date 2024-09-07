import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import tog2023 from '@site/static/img/tog2023.png'
import logo from '@site/static/img/avatar.jpg'
import netease from '@site/static/img/netease.png'
import tencent from '@site/static/img/tencent.png'

const FeatureList = [
  {
    title: 'Support Me',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Give me a star at here <a target="_blank" rel="noopener noreferrer" href="https://github.com/canoeByGuitar">GitHub</a>
      </>
    ),
  },
  {
    title: 'About Me',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Studing at ECNU for M.S. in CS (expected to graduate in June 2025).
        Previously interned at Tencent(Shanghai) IEG R&D and
        NetEase(Hangzhou) ThunderFire FragPunk.
      </>
    ),
  },
  {
    title: 'Contact Me',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        E-mail: canoebyguitar@gmail.com
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  // return (
  //   <section className={styles.features}>
  //     <div className="container">
  //       <div className="row">
  //         {FeatureList.map((props, idx) => (
  //           <Feature key={idx} {...props} />
  //         ))}
  //       </div>
  //     </div>
  //   </section>
  // );
  return (
    <div className="container">
      {/* About Me Section */}
      <div className="about-me">
        <h2>Chenhui Wang 王晨辉</h2>
        <div className="about-me-content">
          <div className='about-me-img'>
            <img src={logo} alt="Chenhui Wang" className="profile-pic" />
          </div>
          <div className="about-me-text">
            <p>
              I am currently studying Master's degree at East China Normal University (ECNU), with an expected graduation in June 2025.
              My research interests lie in computer graphics and physical simulation.
            </p>
            {/* <div className="links">
              <a href="resume-link">Resume</a> / <a href="github-link">Github</a> / <a href="linkedin-link">LinkedIn</a> /
              <a href="google-scholar-link">Google Scholar</a> / <a href="mailto:g1n0st@live.com">Email: g1n0st@live.com</a>
            </div> */}
          </div>
        </div>
      </div>


      <div className="publications">
        <h2>Experience</h2>
        <Experience
          index={1}
          company="NetEase ThunderFire FragPunk"
          role="Game Development Engineer"
          duration="June 2024 – Sep 2024"
          location="Hangzhou, China"
          description="Implemented and optimized Rewind Debugger Toolkits, Character Animation Blueprint and FPS gamemode with UI. "
          image={netease} // Add appropriate image paths
        />

        <Experience
          index={2}
          company="Tencent IEG R&D"
          role="Game Development Engineer"
          duration="Sep 2023 – April 2024"
          location="Shanghai, China"
          description="Research intern in the Animation Technology group, where I worked on Pose Space Deformer Toolkit and Runtime Physical Bone Simulation."
          image={tencent} // Add appropriate image paths
        />
      </div>



      {/* Publications Section */}
      <div className="publications">
        <h2>Publications</h2>
        <Publication
          title="A Unified MPM Framework supporting Phase-field Models and Elastic-viscoplastic Phase Transition"
          authors="Zaili Tu, Chen Li, Zipeng Zhao, Long Liu, Chenhui Wang, Changbo Wang, Hong Qin."
          venue="Transactions on Graphics (TOG) 2023"
          links={{ paper: 'https://dl.acm.org/doi/10.1145/3638047' }}
          imgSrc={tog2023}
        />
      </div>
    </div>
  );
}

function Publication({ title, authors, venue, links, imgSrc }) {
  return (
    <div className="publication">
      <div className='publication-img'>
        <img src={imgSrc} alt={title} className="publicawtion-image" />
      </div>
      <div className="publication-content">
        <h3>{title}</h3>
        <p>{authors}</p>
        <p><strong>{venue}</strong></p>
        <div className="publication-links">
          <a href={links.paper}>[Paper]</a>
        </div>
      </div>
    </div>
  );
}


function Experience({ index, company, role, duration, location, description, image }) {
  return (

    <div className="timeline">
      <div className="timeline-item" key={index}>
        <div className="timeline-dot"></div>
        <div className="timeline-content">
          <div className="experience-card">
            {/* <div className="exp-img-container"> */}
              <img src={image} alt={company} className="experience-image" />
            {/* </div> */}
            <div className="experience-details">
              <h3>{role}</h3>
              <p className="experience-company">{company}</p>
              <p className="experience-duration">{duration} · {location}</p>
              <p className="experience-description">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};