import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Github, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CONTAINER =
  'w-full h-full flex flex-col pointer-events-auto px-6 md:px-16 overflow-y-auto pt-24 pb-12 z-10';

function PageShell({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-gray-500 hover:text-orange-500 transition-colors uppercase mb-10"
      >
        <span className="w-8 h-[1px] bg-gray-400" />
        <ArrowLeft className="w-4 h-4" /> Return to Hub
      </button>
      <div className="text-[10px] font-bold tracking-[0.3em] text-orange-500 uppercase mb-3">{kicker}</div>
      <h1 className="text-3xl md:text-4xl font-black tracking-wide text-gray-900 uppercase mb-8">{title}</h1>
      <div className="w-16 h-1 bg-orange-500 mb-10" />
      <div className="flex flex-col gap-6 text-sm md:text-base leading-relaxed text-gray-700">{children}</div>
    </motion.div>
  );
}

function ProjectList() {
  const projects = [
    { name: 'AnchorDrive', desc: 'UE5 钩锁跑酷游戏，担任主程序，负责钩锁状态机与摆荡移动。' },
    { name: '泡泡双熊', desc: 'UE5 双人合作闯关游戏，担任主程序，负责双人同屏镜头与角色动画。' },
    { name: 'Forest', desc: '2D 闯关作品，负责 2D 角色控制与关卡交互。' },
    { name: 'ActionDemo', desc: '动作游戏 Demo，负责连段配置与输入窗口，基于 GAS + StateTree 战斗框架。' },
    { name: 'Vulkan 3D 小引擎', desc: '个人项目，C++ 手搓实时渲染框架，涉及 Vulkan 渲染管线与顶点去重。' },
    { name: '影侠', desc: 'UE5 战斗镜头与索敌相关的技术实践。' },
  ];
  return (
    <ul className="flex flex-col gap-4">
      {projects.map(p => (
        <li key={p.name} className="bg-white border border-gray-200 p-5">
          <div className="font-bold tracking-wider text-gray-900 uppercase mb-1">{p.name}</div>
          <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
        </li>
      ))}
    </ul>
  );
}

export function AboutPage() {
  return (
    <div className={CONTAINER}>
      <PageShell kicker="About Me" title="关于我">
        <p>
          你好，我是徐同学（mrXu），一名游戏客户端开发方向的开发者。这个博客是我的个人作品集与技术笔记，主要记录游戏开发项目与学习过程。
        </p>
        <p>
          我的项目大多围绕 Unreal Engine 5 展开，关注战斗系统、角色控制、镜头与移动手感，也会手搓渲染相关的东西来理解底层原理。
        </p>
        <h2 className="text-lg font-bold tracking-widest text-gray-900 uppercase mt-4">代表项目</h2>
        <ProjectList />
        <h2 className="text-lg font-bold tracking-widest text-gray-900 uppercase mt-4">实用工具站</h2>
        <p>
          除了游戏开发，我还维护了一个免费在线工具站，提供 JSON 格式化、个税与工资计算器、房贷计算器、汇率换算、BMI 计算等常用工具，打开就能用，不用注册。
        </p>
        <p>
          <a
            href="https://tools.mrxublog.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-orange-600 hover:text-orange-500 transition-colors"
          >
            <Wrench className="w-4 h-4" /> 访问实用工具站 tools.mrxublog.cn
          </a>
        </p>
        <p>
          <a
            href="https://github.com/Guevana"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-gray-800 hover:text-orange-500 transition-colors"
          >
            <Github className="w-4 h-4" /> GitHub：Guevana
          </a>
        </p>
      </PageShell>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className={CONTAINER}>
      <PageShell kicker="Contact" title="联系我">
        <p>
          如果你对本站的项目、技术文章或实用工具有任何问题、建议，或者想交流游戏开发相关的内容，欢迎通过 GitHub 联系我。
        </p>
        <p>
          <a
            href="https://github.com/Guevana"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-gray-800 hover:text-orange-500 transition-colors"
          >
            <Github className="w-4 h-4" /> GitHub：github.com/Guevana
          </a>
        </p>
        <p className="text-gray-500 text-sm">
          本站不设公开邮箱，所有联系请走 GitHub，看到后会尽快回复。
        </p>
        <p>
          也可以先去 <Link to="/about" className="font-bold text-orange-600 hover:text-orange-500 transition-colors">关于我</Link> 页面了解一下本站的项目，或去{' '}
          <a
            href="https://tools.mrxublog.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-orange-600 hover:text-orange-500 transition-colors"
          >
            实用工具站
          </a>{' '}
          试用免费在线工具。
        </p>
      </PageShell>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className={CONTAINER}>
      <PageShell kicker="Privacy Policy" title="隐私政策">
        <p className="text-gray-500 text-sm">最后更新：2026 年 11 月 11 日</p>
        <h2 className="text-lg font-bold tracking-widest text-gray-900 uppercase mt-4">我们收集什么</h2>
        <p>
          本站使用自建 Umami 统计服务统计匿名访问量，不使用 Cookie 追踪个人身份，不收集姓名、邮箱等个人信息。
        </p>
        <h2 className="text-lg font-bold tracking-widest text-gray-900 uppercase mt-4">广告与 Cookie</h2>
        <p>
          本站使用 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie，根据你过往对本网站或其他网站的访问记录来展示广告。
          你可以随时访问 Google 广告设置，选择停用个性化广告。停用后，你仍会看到广告，但广告将不再基于你的兴趣进行个性化。
        </p>
        <p>
          第三方供应商（包括 Google）会使用 Cookie 在本站投放广告。更多信息请参阅 Google 的隐私政策与广告政策。
        </p>
        <h2 className="text-lg font-bold tracking-widest text-gray-900 uppercase mt-4">外部链接</h2>
        <p>
          本站包含指向外部网站的链接（例如 GitHub、实用工具站 tools.mrxublog.cn）。点击这些链接后，你将受对方网站的隐私政策约束，本站不对其内容或隐私做法负责。
        </p>
        <h2 className="text-lg font-bold tracking-widest text-gray-900 uppercase mt-4">联系</h2>
        <p>
          如对本隐私政策有任何疑问，请通过{' '}
          <Link to="/contact" className="font-bold text-orange-600 hover:text-orange-500 transition-colors">联系页面</Link>{' '}
          与我取得联系。
        </p>
      </PageShell>
    </div>
  );
}
