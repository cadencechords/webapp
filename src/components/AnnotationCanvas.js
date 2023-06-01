import { useGesture } from '@use-gesture/react';
import React, { useRef, useState } from 'react';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import { getThemeAwareAnnotationColor } from '../utils/color.utils';
import useTheme from '../hooks/useTheme';

export default function AnnotationCanvas({
  defaultAnnotations = [],
  onChange,
}) {
  const { isDark } = useTheme();
  const ref = useRef();
  const { color, strokeWidth, utensil } = useAnnotationsToolbar();
  const [eraserPosition, setEraserPosition] = useState();
  const [paths, setPaths] = useState(defaultAnnotations);

  useGesture(
    {
      onDragStart: e => {
        if (utensil === 'scroll') return;
        else if (utensil === 'eraser') {
          const left = e.xy[0] - ref.current?.getBoundingClientRect().x;
          const top = e.xy[1] - ref.current?.getBoundingClientRect().y;
          setEraserPosition([left, top]);

          setPaths(previousPaths => {
            return previousPaths.filter(annotation => {
              const path = annotation.path.replace('M ', '');
              const points = path.split(' L ').map(point => {
                const parts = point.split(' ');
                return { x: parseFloat(parts[0]), y: parseFloat(parts[1]) };
              });

              for (let point of points) {
                if (isInEraserCircle(point, { x: left, y: top })) return false;
              }

              return true;
            });
          });
        } else {
          const left = e.xy[0] - ref.current?.getBoundingClientRect().x;
          const top = e.xy[1] - ref.current?.getBoundingClientRect().y;

          setPaths(previousPaths => {
            let newPaths = [...previousPaths];
            newPaths[previousPaths.length] = {
              path: `M ${left} ${top}`,
              color,
              stroke_width: strokeWidth,
            };

            return newPaths;
          });
        }
      },
      onDrag: e => {
        if (utensil === 'scroll') return;
        else if (utensil === 'eraser') {
          const left = e.xy[0] - ref.current?.getBoundingClientRect().x;
          const top = e.xy[1] - ref.current?.getBoundingClientRect().y;
          setEraserPosition([left, top]);

          setPaths(previousPaths => {
            return previousPaths.filter(annotation => {
              const path = annotation.path.replace('M ', '');
              const points = path.split(' L ').map(point => {
                const parts = point.split(' ');
                return { x: parseFloat(parts[0]), y: parseFloat(parts[1]) };
              });

              for (let point of points) {
                if (isInEraserCircle(point, { x: left, y: top })) return false;
              }

              return true;
            });
          });
        } else {
          const left = e.xy[0] - ref.current?.getBoundingClientRect().x;
          const top = e.xy[1] - ref.current?.getBoundingClientRect().y;
          setPaths(previousPaths => {
            const index = previousPaths.length - 1;
            let newPaths = [...previousPaths];
            if (newPaths?.[index]?.path) {
              newPaths[index].path += ` L ${left} ${top}`;
              return newPaths;
            }
            return previousPaths;
          });
        }
      },
      onDragEnd: () => {
        if (utensil === 'eraser') setEraserPosition(undefined);
        if (utensil !== 'scroll') onChange(paths);
      },
    },
    {
      target: ref,
    }
  );

  return (
    <svg
      ref={ref}
      className="absolute top-0 left-0 z-10 w-full h-full"
      style={{ touchAction: utensil === 'scroll' ? 'pan-y' : 'none' }}
    >
      {paths.map((path, index) => (
        <path
          d={path.path}
          fill="transparent"
          key={index}
          stroke={getThemeAwareAnnotationColor(path.color, isDark)}
          strokeWidth={path.stroke_width}
        />
      ))}
      {eraserPosition && (
        <circle
          cx={eraserPosition[0]}
          cy={eraserPosition[1]}
          r={20}
          fill="transparent"
          stroke="gray"
          strokeWidth={6}
        />
      )}
    </svg>
  );
}

function isInEraserCircle(svgPoint, centerOfCircle) {
  const distance = Math.sqrt(
    Math.pow(svgPoint.x - centerOfCircle.x, 2) +
      Math.pow(svgPoint.y - centerOfCircle.y, 2)
  );

  return distance < 20;
}
