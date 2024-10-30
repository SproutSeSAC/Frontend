import JavaIcon from '@/assets/techStack/Java.svg?react';
import JavascriptIcon from '@/assets/techStack/JavaScript.svg?react';
import KotlinIcon from '@/assets/techStack/Kotlin.svg?react';
import NodeJsIcon from '@/assets/techStack/Node.js.svg?react';
import PandasIcon from '@/assets/techStack/Pandas.svg?react';
import PythonIcon from '@/assets/techStack/Python.svg?react';
import ReactIcon from '@/assets/techStack/React.svg?react';
import SQLIcon from '@/assets/techStack/SQL.svg?react';
import SpringIcon from '@/assets/techStack/Spring.svg?react';
import VueIcon from '@/assets/techStack/Vue.js.svg?react';

interface TechStackIconProps {
  techStack: string;
  className?: string;
}

export default function TechStackIcon({
  techStack,
  className = '',
}: TechStackIconProps) {
  if (techStack === 'React') return <ReactIcon className={className} />;
  if (techStack === 'JavaScript' || techStack === '자바스크립트')
    return <JavascriptIcon className={className} />;
  if (techStack === 'Java' || techStack === '자바')
    return <JavaIcon className={className} />;
  if (techStack === 'Kotlin' || techStack === '코틀린')
    return <KotlinIcon className={className} />;
  if (techStack === 'Pandas') return <PandasIcon className={className} />;
  if (techStack === 'Python') return <PythonIcon className={className} />;
  if (techStack === 'Spring' || techStack === '스프링')
    return <SpringIcon className={className} />;
  if (techStack === 'Vue.js') return <VueIcon className={className} />;
  if (techStack === 'Node.js') return <NodeJsIcon className={className} />;
  if (techStack === 'SQL') return <SQLIcon className={className} />;

  return <ReactIcon className={className} />;
}
