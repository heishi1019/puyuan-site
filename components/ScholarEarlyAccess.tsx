import Button from "@/components/Button";
import InteractiveGridBackground from "@/components/InteractiveGridBackground";

export default function ScholarEarlyAccess() {
  return <section id="early-access" className="scholar-early-access scholar-early-access--dark scroll-mt-24">
    <InteractiveGridBackground />
    <div className="scholar-early-access__content">
      <p>Early access</p>
      <h2>带着真实研究任务，<br />一起测试科小文。</h2>
      <span>个人研究者可以申请免费内测；实验室、课题组与科研机构可以沟通试用范围和合作方式。</span>
      <div className="scholar-early-access__actions"><Button href="mailto:hello@puyuan.tech?subject=ScholarPilot%20%E5%85%8D%E8%B4%B9%E5%86%85%E6%B5%8B%E7%94%B3%E8%AF%B7" size="lg">申请免费内测</Button><Button href="mailto:hello@puyuan.tech?subject=ScholarPilot%20%E6%9C%BA%E6%9E%84%E8%AF%95%E7%94%A8%E4%B8%8E%E5%90%88%E4%BD%9C" variant="secondary" size="lg">机构试用与合作</Button></div>
    </div>
  </section>;
}
