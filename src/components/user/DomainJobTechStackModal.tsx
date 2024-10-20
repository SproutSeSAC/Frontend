import { useDialogContext, useUpdateProfile } from '@/hooks';
import {
  Domain,
  Job,
  TechStack,
  UpdateableUserProfile,
  UserProfile,
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';

import Tag from '@/components/common/Tag';
import SquareButton from '@/components/common/button/SquareButton';
import Dropdown, { Option } from '@/components/common/dropdown/Dropdown';
import MultiSelectDropdown, {
  OptionItem,
} from '@/components/common/dropdown/MultiSelectDropdown';
import Label from '@/components/common/input/Label';
import Modal from '@/components/common/modal/Modal';
import { DomainJobTechStackSchema } from '@/components/user/DomainJobTechStackSchema';

type FormValue = {
  updatedTechStackList: TechStack[];
  updatedJobList: Job[];
  updatedDomainList: Domain[];
};

type GetOptions = (type: 'domain' | 'job', list: Domain[] | Job[]) => Option[];

export default function DomainJobTechStackModal() {
  const { hideDialog } = useDialogContext();

  const {
    userProfile,
    domainList: allDomainList,
    jobList: allJobList,
    techStackList: allTechStackList,
    // mutateAsync,
    isLoading,
  } = useUpdateProfile();

  const {
    jobList: userJobList,
    techStackList: userTechStackList,
    domainList: userDomainList,
  } = userProfile as UserProfile;

  const defaultFormValues: FormValue = {
    updatedTechStackList: userTechStackList,
    updatedJobList: userJobList,
    updatedDomainList: userDomainList,
  };

  const methods = useForm<FormValue>({
    mode: 'onSubmit',
    defaultValues: defaultFormValues,
    resolver: zodResolver(DomainJobTechStackSchema),
  });

  const { handleSubmit, control } = methods;

  const onSubmit: SubmitHandler<FormValue> = (formData: FormValue) => {
    const { updatedTechStackList, updatedDomainList, updatedJobList } =
      formData;

    const updatableValue: Partial<UpdateableUserProfile> = {
      updatedDomainIdList: updatedDomainList.map(({ id }) => id),
      updatedJobIdList: updatedJobList.map(({ id }) => id),
      updatedTechStackIdList: updatedTechStackList.map(({ id }) => id),
    };
    console.log(updatableValue);
    // mutateAsync(updatableValue); // 이후 테스트 예정
  };

  const getOptions: GetOptions = (type, list) => {
    switch (type) {
      case 'domain':
        return (list as Domain[]).map(({ id, domain }) => {
          return { id, name: domain };
        });
      case 'job':
        return (list as Job[]).map(({ id, job }) => {
          return { id, name: job };
        });
      default:
        return [];
    }
  };

  const getTechStackOptions = () => {
    return userTechStackList.map(({ jobName, techStack, ...rest }) => {
      return { name: techStack, type: jobName, ...rest };
    });
  };

  const watchedDomainList = useWatch({ control, name: 'updatedDomainList' });
  const watchedJobList = useWatch({ control, name: 'updatedJobList' });

  const jobOptions = getOptions('job', watchedJobList);

  const domainOptions: Option[] = getOptions('domain', watchedDomainList);
  const initialTechStackOptions: OptionItem[] = getTechStackOptions();

  if (isLoading) return null;

  return (
    <Modal onToggleClick={hideDialog} title="도메인 정보">
      <FormProvider {...methods}>
        <form
          className="mt-3 flex w-[350px] flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label htmlFor="관심 도메인" className="mb-2" />
            {allDomainList && (
              <Controller
                control={control}
                name="updatedDomainList"
                render={({ field: { onChange } }) => {
                  return (
                    <>
                      <ul className="flex gap-1">
                        {watchedDomainList.map(({ id, domain }) => (
                          <li key={id}>
                            <Tag
                              text={domain}
                              color="green"
                              size="medium"
                              onDeleteClick={() => {
                                const filteredData = watchedDomainList.filter(
                                  ({ id: itemId }) => itemId !== id,
                                );
                                onChange(filteredData);
                              }}
                            />
                          </li>
                        ))}
                      </ul>

                      <Dropdown
                        label="관심 도메인"
                        selectedOptions={domainOptions}
                        options={getOptions('domain', allDomainList)}
                        selectBoxClassName="[&>span]:text-gray1 mt-2"
                        onChangeValue={data => {
                          const newData = data.map(({ id, name }) => {
                            return { id, domain: name };
                          });
                          const newArr = [...watchedDomainList, ...newData];
                          onChange(newArr);
                        }}
                      />
                    </>
                  );
                }}
              />
            )}
          </div>

          <div>
            <Label htmlFor="관심 직무" />
            {allJobList && (
              <Controller
                control={control}
                name="updatedJobList"
                render={({ field: { onChange } }) => {
                  return (
                    <>
                      <ul className="flex gap-1">
                        {watchedJobList?.map(({ id, job }) => (
                          <li key={id}>
                            <Tag
                              text={job}
                              color="olivegreen"
                              size="medium"
                              onDeleteClick={() => {
                                const filteredData = watchedJobList.filter(
                                  item => item.id !== id,
                                );
                                onChange(filteredData);
                              }}
                            />
                          </li>
                        ))}
                      </ul>

                      <Dropdown
                        label="관심 직무"
                        selectedOptions={jobOptions}
                        options={getOptions('job', allJobList)}
                        selectBoxClassName="[&>span]:text-gray1 mt-2"
                        onChangeValue={data => {
                          const newData = data.map(({ id, name }) => {
                            return { id, job: name };
                          });
                          const newArr = [...watchedJobList, ...newData];
                          onChange(newArr);
                        }}
                      />
                    </>
                  );
                }}
              />
            )}
          </div>

          <div className="relative">
            <Label htmlFor="기술 스택" />

            <Controller
              control={control}
              name="updatedTechStackList"
              render={({ field: { onChange } }) => {
                return (
                  <MultiSelectDropdown
                    label="기술스택"
                    defaultValue="백엔드"
                    width="100%"
                    buttonClassName="p-3 border-gray4"
                    contentClassName="w-full"
                    options={allTechStackList}
                    initialSelectedOptions={
                      initialTechStackOptions as OptionItem[]
                    }
                    onChangeValue={data => onChange(data)}
                  />
                );
              }}
            />
          </div>

          <SquareButton name="저장하기" type="submit" className="self-end" />
        </form>
      </FormProvider>
    </Modal>
  );
}
