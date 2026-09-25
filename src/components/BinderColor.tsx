import Icon from './Icon';

type BinderColorProps = {
  // A key of COLORS, 'none' (a crossed-out swatch) or 'white' (no fill).
  color?: string;
  onClick?: (color: string) => void;
  block?: boolean;
  size?: keyof typeof HEIGHT_SIZES | `${keyof typeof HEIGHT_SIZES}`;
  editable?: boolean;
};

export default function BinderColor({
  color = 'white',
  onClick,
  block,
  size = '4',
  editable = true,
}: BinderColorProps) {
  const handleClick = () => {
    if (onClick && editable) {
      onClick(color);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${HEIGHT_SIZES[size]} 
				focus:outline-hidden outline-hidden flex-center rounded-sm ${COLORS[color]}
				${block ? ' w-full py-3' : WIDTH_SIZES[size]} 
				${onClick ? ' cursor-pointer' : ' cursor-default'} 
				${color === 'none' ? ' border border-gray-300 dark:border-dark-gray-400 ' : ''}
			`}
    >
      {color === 'none' ? (
        <Icon name="close" filled className="w-3 h-3 text-gray-600" />
      ) : (
        ''
      )}
    </div>
  );
}

const HEIGHT_SIZES = {
  3: 'h-3',
  4: 'h-4',
};

const WIDTH_SIZES = {
  3: 'w-3',
  4: 'w-4',
};

const COLORS: Record<string, string> = {
  red: 'bg-red-400',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  yellow: 'bg-yellow-400',
  indigo: 'bg-indigo-400',
  purple: 'bg-purple-400',
  pink: 'bg-pink-400',
  gray: 'bg-gray-400',
};
