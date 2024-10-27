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
} from 'react-hook-form';

import Tag from '@/components/common/Tag';
import SquareButton from '@/components/common/button/SquareButton';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown, {
  OptionItem,
} from '@/components/common/dropdown/TechStackDropdown';
import { Option } from '@/components/common/dropdown/option/SelectOption';
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
    mutateAsync,
    isLoading,
  } = useUpdateProfile();

  const {
    nickname,
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
    const { updatedDomainList, updatedJobList, updatedTechStackList } =
      formData;

    const updatableValue: Partial<UpdateableUserProfile> = {
      updatedDomainIdList: updatedDomainList.map(({ id }) => id),
      updatedJobIdList: updatedJobList.map(({ id }) => id),
      updatedTechStackIdList: updatedTechStackList.map(({ id }) => id),
      nickname,
    };

    mutateAsync(updatableValue); // 이후 테스트 예정
    hideDialog();
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

  const initialTechStackOptions: OptionItem[] = getTechStackOptions();

  if (isLoading) return null;

  return (
    <Modal onToggleClick={hideDialog} title="도메인 정보" className="p-4">
      <FormProvider {...methods}>
        <form
          className="flex w-[350px] flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="관심 도메인" />
            {allDomainList && (
              <Controller
                control={control}
                name="updatedDomainList"
                render={({
                  field: { onChange, value },
                  formState: { errors },
                }) => {
                  const selectedOptions = value?.map(({ id, domain }) => ({
                    id,
                    name: domain,
                  }));

                  return (
                    <>
                      <ScrollContainer gap={1}>
                        {value.map(({ id, domain }) => (
                          <li key={id}>
                            <Tag
                              text={domain}
                              color="green"
                              size="medium"
                              onDeleteClick={() => {
                                const filteredData = value.filter(
                                  item => item.id !== id,
                                );
                                onChange(filteredData);
                              }}
                            />
                          </li>
                        ))}
                      </ScrollContainer>

                      <SingleSelectDropdown
                        defaultLabel="관심 도메인"
                        options={getOptions('domain', allDomainList)}
                        selectedOptions={selectedOptions}
                        onChangeValue={data => {
                          const newData = data.map(({ id, name }) => ({
                            id,
                            domain: name,
                          }));
                          const newArr = [...value, ...newData];
                          onChange(newArr);
                        }}
                        selectBoxClassName="h-[50px] !text-base"
                        errorMsg={errors.updatedDomainList?.message}
                      />
                    </>
                  );
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="관심 직무" />
            {allJobList && (
              <Controller
                control={control}
                name="updatedJobList"
                render={({
                  field: { onChange, value },
                  formState: { errors },
                }) => {
                  const selectedOptions = value?.map(({ id, job }) => ({
                    id,
                    name: job,
                  }));
                  return (
                    <>
                      <ScrollContainer gap={1}>
                        {value?.map(({ id, job }) => (
                          <li key={id}>
                            <Tag
                              text={job}
                              color="olivegreen"
                              size="medium"
                              onDeleteClick={() => {
                                const filteredData = value.filter(
                                  item => item.id !== id,
                                );
                                onChange(filteredData);
                              }}
                            />
                          </li>
                        ))}
                      </ScrollContainer>

                      <SingleSelectDropdown
                        defaultLabel="관심 직무"
                        options={getOptions('job', allJobList)}
                        selectedOptions={selectedOptions}
                        onChangeValue={data => {
                          const newData = data.map(({ id, name }) => ({
                            id,
                            job: name,
                          }));
                          const newArr = [...value, ...newData];
                          onChange(newArr);
                        }}
                        selectBoxClassName="h-[50px] !text-base"
                        errorMsg={errors.updatedJobList?.message}
                      />
                    </>
                  );
                }}
              />
            )}
          </div>

          <div className="relative flex flex-col gap-1.5">
            <Label htmlFor="기술 스택" />
            <Controller
              control={control}
              name="updatedTechStackList"
              render={({ field: { onChange }, formState: { errors } }) => {
                return (
                  <TechStackDropdown
                    defaultLabel="기술스택"
                    defaultTabValue="백엔드"
                    options={allTechStackList}
                    initialSelectedOptions={initialTechStackOptions}
                    onChangeValue={onChange}
                    isMarkTechStackList
                    errorMsg={errors.updatedTechStackList?.message}
                    selectBoxClassName="h-[50px] !text-base"
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
