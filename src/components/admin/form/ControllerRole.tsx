import { rolesArr } from '@/constants';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';

export default function ControllerRole() {
  const { control } = useFormContext();

  const currRole = useWatch({ control, name: 'role' });

  return (
    <Controller
      control={control}
      name="role"
      render={({ field: { onChange } }) => {
        return (
          <div className="mb-6 mt-4 h-[300px]">
            <ul className="flex flex-wrap gap-3">
              {rolesArr?.map(({ key, label }) => (
                <li key={key}>
                  <SquareButton
                    name={label}
                    color={currRole !== key ? 'inActive' : 'mainBlue'}
                    onClick={() => onChange(key)}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
