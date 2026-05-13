import { Client } from '@notionhq/client';

const notion = new Client({
  auth: 'ntn_b47896027991esG3Ngbx3c9yqdMeJOgAbztbmMJQb5laCs',
});

// Database IDs
export const DATABASE_IDS = {
  honors: '35f11d7b89ef81d2a06ad29752d4d8c7',
  rewards: '35f11d7b89ef81d18e78e6ea03f052dd',
  allowance: '35f11d7b89ef81bb9b48e04f68e23723',
  photos: '35f11d7b89ef8127acc5da1fca3e82ae',
  profile: '35f11d7b89ef8147a5f8ddb33dbadba2',
};

// Helper to get rich text value
function getRichText(value: any): string {
  if (!value) return '';
  return value.map((t: any) => t.plain_text).join('');
}

// Helper to get file URL
function getFileUrl(files: any): string {
  if (!files || files.length === 0) return '';
  const file = files[0];
  if (file.type === 'file') {
    let url = file.file.url;
    if (!url.includes('?')) url += '?cache=v2';
    return url;
  }
  if (file.type === 'external') {
    let url = file.external.url;
    if (!url.includes('?')) url += '?cache=v2';
    return url;
  }
  return '';
}

// Helper to get select value
function getSelect(value: any): string {
  if (!value) return '';
  return value.name || '';
}

// Helper to get multi select values
function getMultiSelect(value: any): string[] {
  if (!value) return [];
  return value.map((s: any) => s.name || '');
}

// Helper to get date value
function getDate(value: any): string {
  if (!value || !value.start) return '';
  return value.start;
}

// Helper to get number value
function getNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  return value;
}

// Query a database (data source in v5)
async function queryDatabase(databaseId: string, sorts: any[] = []) {
  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      sorts,
    });
    return response.results;
  } catch (error) {
    console.error(`Failed to query database ${databaseId}:`, error);
    return [];
  }
}

// ===== 荣誉榜 =====
export interface HonorItem {
  id: string;
  name: string;
  organization: string;
  date: string;
  level: string;
  category: string;
  imageUrl: string;
  description: string;
}

export async function getHonors(): Promise<HonorItem[]> {
  const results = await queryDatabase(DATABASE_IDS.honors, [
    { property: '获奖日期', direction: 'descending' as const },
  ]);

  return results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      name: getRichText(props['名称']?.title),
      organization: getRichText(props['颁发机构']?.rich_text),
      date: getDate(props['获奖日期']?.date),
      level: getSelect(props['级别']?.select),
      category: getSelect(props['类别']?.select),
      imageUrl: getFileUrl(props['证书图片']?.files),
      description: getRichText(props['描述']?.rich_text),
    };
  });
}

// ===== 日常奖励 =====
export interface RewardItem {
  id: string;
  name: string;
  date: string;
  level: string;
  categories: string[];
  status: string;
  useDate: string;
  useReason: string;
  photoUrl: string;
}

export async function getRewards(): Promise<RewardItem[]> {
  const results = await queryDatabase(DATABASE_IDS.rewards, [
    { property: '获取日期', direction: 'descending' as const },
  ]);

  return results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      name: getRichText(props['名称']?.title),
      date: getDate(props['获取日期']?.date),
      level: getSelect(props['等级']?.select),
      categories: getMultiSelect(props['类别']?.multi_select),
      status: getSelect(props['状态']?.select),
      useDate: getDate(props['使用日期']?.date),
      useReason: getRichText(props['使用原因']?.rich_text),
      photoUrl: getFileUrl(props['照片']?.files),
    };
  });
}

// ===== 零用钱 =====
export interface AllowanceItem {
  id: string;
  name: string;
  date: string;
  type: string;
  amount: number;
  note: string;
}

export async function getAllowance(): Promise<AllowanceItem[]> {
  const results = await queryDatabase(DATABASE_IDS.allowance, [
    { property: '日期', direction: 'descending' as const },
  ]);

  return results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      name: getRichText(props['项目']?.title),
      date: getDate(props['日期']?.date),
      type: getSelect(props['类型']?.select),
      amount: getNumber(props['金额']?.number),
      note: getRichText(props['备注']?.rich_text),
    };
  });
}

// ===== 照片墙 =====
export interface PhotoItem {
  id: string;
  name: string;
  photoUrl: string;
  size: string;
  orientation: string;
  order: number;
}

export async function getPhotos(): Promise<PhotoItem[]> {
  const results = await queryDatabase(DATABASE_IDS.photos, [
    { property: '排序', direction: 'ascending' as const },
  ]);

  return results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      name: getRichText(props['照片名称']?.title),
      photoUrl: getFileUrl(props['照片']?.files),
      size: getSelect(props['尺寸']?.select),
      orientation: getSelect(props['方向']?.select),
      order: getNumber(props['排序']?.number),
    };
  });
}

// ===== 简历信息 =====
export interface ProfileItem {
  id: string;
  title: string;
  type: string;
  content: string;
  icon: string;
  order: number;
}

export async function getProfile(): Promise<ProfileItem[]> {
  const results = await queryDatabase(DATABASE_IDS.profile, [
    { property: '排序', direction: 'ascending' as const },
  ]);

  return results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      title: getRichText(props['标题']?.title),
      type: getSelect(props['类型']?.select),
      content: getRichText(props['内容']?.rich_text),
      icon: getRichText(props['图标']?.rich_text),
      order: getNumber(props['排序']?.number),
    };
  });
}
