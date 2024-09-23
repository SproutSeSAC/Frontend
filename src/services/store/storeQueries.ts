// import { useInfiniteQuery } from '@tanstack/react-query';

// interface Params {
//   [key: string]: any;
// }

// export const apiInstance = axios.create({
//   baseURL: 'www.~~',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json; charset=utf-8',
//   },
//   withCredentials: true,
// });

// export const useGetInfiniteStoreCardList = (
//   params: Params,
// ) => {
//   return useInfiniteQuery<any>(
//     ['useGetInfiniteStoreCardList', params],
//     async ({ pageParam = 0 }) => {
//       const { data } = await apiInstance.get<any>(
//         `/api 엔드포인트 `,
//         { params: { ...params, page: (pageParam as number) + 1 } },
//       );
//       return data;
//     },
//     {
//       getNextPageParam: (data, pages) => {
//         if (data.totalPages === 0 || data.totalPages === pages.length)
//           return undefined;
//         return pages.length;
//       },
//     },
//   );
// };
