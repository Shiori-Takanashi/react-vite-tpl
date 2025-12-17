// src/pages/DoubleWrapperWithOutlet.jsx
import data from "../data/doubleWrapperWithOutlet.json";
import PageLayout from "../layouts/PageLayout";
import "../styles/doubleWrapper.css";

export default function DoubleWrapperWithOutlet() {
  return (
    <PageLayout title={data.title}>
      <div className="double-wrapper-outlet">
        <h2>{data.heading}</h2>
        <p>{data.description}</p>
        <p>{data.domStructureLabel}</p>
        <pre className="double-wrapper-code">{data.domStructure}</pre>
        <h3>{data.problemsHeading}</h3>
        <ul>
          {data.problems.map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
        <h3 className="double-wrapper-subheading">{data.patternHeading}</h3>
        <p>{data.patternDescription}</p>
        {/* ここに子ルートの Outlet を配置することもできます */}
        {/* <Outlet /> */}
      </div>
    </PageLayout>
  );
}
