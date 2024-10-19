import { useTechStackList } from '@/hooks/useTechStackList';

import { useGetUserProfile } from '@/services/auth/authQueries';
import {
  useGetDomainList,
  useGetJobList,
} from '@/services/specifications/specificationsQueries';

import { useDialogContext } from '@/hooks';
import { Domain, Job, TechStack, UserProfile } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import Tag from '@/components/common/Tag';
import SquareButton from '@/components/common/button/SquareButton';
import XButton from '@/components/common/button/XButton';
import Dropdown from '@/components/common/dropdown/Dropdown';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import Label from '@/components/common/input/Label';
import Modal from '@/components/common/modal/Modal';
import { DomainJobTechStackSchema } from '@/components/user/DomainJobTechStackSchema';

type FormValue = {
  updatedTechStackList: TechStack[];
  updatedJobList: Job[];
  updatedDomainList: Domain[];
};

export default function DomainJobTechStackModal() {
  const { hideDialog } = useDialogContext();

  const { data: userProfile } = useGetUserProfile();

  const { data: allJobList, isLoading: isGetJobListLoading } = useGetJobList();

  const { data: allDomainList, isLoading: isGetDomainListLoading } =
    useGetDomainList();

  const {
    techStackList: allTechStackList,
    isTechStackListLoading, //
  } = useTechStackList();

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

  const watchedDomainList = useWatch({ control, name: 'updatedDomainList' });
  const watchedJobList = useWatch({ control, name: 'updatedJobList' });
  const watchedTechStackList = useWatch({
    control,
    name: 'updatedTechStackList',
  });

  const onSubmit = (formData: FormValue) => {
    console.log(formData);

    // const updatableValue: Partial<UpdateableUserProfile> = {
    //   updatedDomainIdList: [1, 2, 3],
    // };

    // mutateAsync(updatableValue);
  };

  const getOptions = (type: 'domain' | 'job', list: Domain[] | Job[]) => {
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

  const jobOptions = getOptions('job', watchedJobList);
  const domainOptions = getOptions('domain', watchedDomainList);

  if (isTechStackListLoading || isGetJobListLoading || isGetDomainListLoading)
    return null;

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
                        {watchedDomainList?.map(({ id, domain }) => (
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
                  <>
                    <ul className="mb-2 flex gap-3.5">
                      {watchedTechStackList?.map(
                        ({ id, techStack, iconImageUrl }) => (
                          <li
                            key={id}
                            className="relative size-10 flex-shrink-0 rounded-lg bg-vividGreen3"
                          >
                            <img src={iconImageUrl} alt={techStack} />
                            <XButton
                              className="absolute -right-1 -top-1 rounded-full bg-black"
                              onDeleteClick={() => {
                                const filteredData =
                                  watchedTechStackList.filter(
                                    item => item.id !== id,
                                  );
                                onChange(filteredData);
                              }}
                            />
                          </li>
                        ),
                      )}
                    </ul>

                    <MultiSelectDropdown
                      label="기술스택"
                      defaultValue="백엔드"
                      width="100%"
                      buttonClassName="p-3 border-gray4"
                      contentClassName="w-full"
                      options={allTechStackList}
                      onChangeValue={data => {
                        const newArr = [
                          ...watchedTechStackList,
                          ...data.filter(
                            item =>
                              !watchedTechStackList.some(
                                existing => existing.id === item.id,
                              ),
                          ),
                        ];
                        onChange(newArr);
                      }}
                    />
                  </>
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
