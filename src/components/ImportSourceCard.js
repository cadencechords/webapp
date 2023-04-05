import React from 'react';
import Card from './Card';
import Button from './Button';
import { Link } from 'react-router-dom';

export default function ImportSourceCard({ title, children, image, to }) {
  return (
    <Card className="flex flex-col justify-between dark:bg-dark-gray-800">
      <div>
        <div className="flex items-center gap-4">
          {image}
          <span className="font-medium ">{title}</span>
        </div>
        <div className="my-4">{children}</div>
      </div>
      <Link to={to}>
        <Button size="xs" variant="accent" full={true}>
          Import
        </Button>
      </Link>
    </Card>
  );
}
