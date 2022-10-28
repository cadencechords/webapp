import { useState } from 'react';

export default function useSegmentedControl(
  options = [],
  { defaultIndex = 0 } = { defaultIndex: 0 }
) {
  const [selectedOption, setSelectedOption] = useState(options[defaultIndex]);
}
