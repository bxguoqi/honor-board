// Notion API helper - using fetch directly to avoid client version issues

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Database IDs
export const DATABASE_IDS = {
  honors: '35f11d7b89ef81d2a06ad29752d4d8c7',
  rewards: '35f11d7b89ef81d18e78e6ea03f052dd',
  allowance: '35f11d7b89ef81bb9b48e04f68e23723',
  photos: '35f11d7b89ef8127acc5da1fca3e82ae',
  profile: '35f11d7b89ef8147a5f8ddb33dbadba2',
};

// Helper functions
function getRichText(value: any): string {
  if (!value) return '';
  if (Array.isArray(value)) return value.map((t: any) => t.plain_text || '').join('');
  return '';
}

function getFileUrl(files: any): string {
  if (!files || !Array.isArray(files) || files.length === 0) return '';
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

function getSelect(value: any): string {
  if (!value) return '';
  return value.name || '';
}

function getMultiSelect(value: any): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : []).map((s: any) => s.name || '');
}

function getDate(value: any): string {
  if (!value || !value.start) return '';
  return value.start;
}

function getNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  return value;
}

// Query database
async function queryDatabase(databaseId: string, sorts: any[] = []): Promise<any[]> {
  try {
    const res = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sorts, page_size: 100 }),
    });
    if (!res.ok) {
      console.error(`Notion API error ${res.status}: ${await res.text()}`);
      return [];
    }
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error(`Failed to query database ${databaseId}:`, error);
    return [];
  }
}

// ===== Types =====
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

export interface AllowanceItem {
  id: string;
  name: string;
  date: string;
  type: string;
  amount: number;
  note: string;
}

export interface PhotoItem {
  id: string;
  name: string;
  photoUrl: string;
  size: string;
  orientation: string;
  order: number;
}

export interface ProfileItem {
  id: string;
  title: string;
  type: string;
  content: string;
  icon: string;
  order: number;
}

// ===== 荣誉榜 =====
export async function getHonors(): Promise<HonorItem[]> {
  const results = await queryDatabase(DATABASE_IDS.honors, [
    { property: '获奖日期', direction: 'descending' },
  ]);
  return results.map((page: any) => {
    const p = page.properties;
    return {
      id: page.id,
      name: getRichText(p['名称']?.title),
      organization: getRichText(p['颁发机构']?.rich_text),
      date: getDate(p['获奖日期']?.date),
      level: getSelect(p['级别']?.select),
      category: getSelect(p['类别']?.select),
      imageUrl: getFileUrl(p['证书图片']?.files),
      description: getRichText(p['描述']?.rich_text),
    };
  });
}

// ===== 日常奖励 =====
export async function getRewards(): Promise<RewardItem[]> {
  const results = await queryDatabase(DATABASE_IDS.rewards, [
    { property: '获取日期', direction: 'descending' },
  ]);
  return results.map((page: any) => {
    const p = page.properties;
    return {
      id: page.id,
      name: getRichText(p['名称']?.title),
      date: getDate(p['获取日期']?.date),
      level: getSelect(p['等级']?.select),
      categories: getMultiSelect(p['类别']?.multi_select),
      status: getSelect(p['状态']?.select),
      useDate: getDate(p['使用日期']?.date),
      useReason: getRichText(p['使用原因']?.rich_text),
      photoUrl: getFileUrl(p['照片']?.files),
    };
  });
}

// ===== 零用钱 =====
export async function getAllowance(): Promise<AllowanceItem[]> {
  const results = await queryDatabase(DATABASE_IDS.allowance, [
    { property: '日期', direction: 'descending' },
  ]);
  return results.map((page: any) => {
    const p = page.properties;
    return {
      id: page.id,
      name: getRichText(p['项目']?.title),
      date: getDate(p['日期']?.date),
      type: getSelect(p['类型']?.select),
      amount: getNumber(p['金额']?.number),
      note: getRichText(p['备注']?.rich_text),
    };
  });
}

// ===== 照片墙 =====
export async function getPhotos(): Promise<PhotoItem[]> {
  const results = await queryDatabase(DATABASE_IDS.photos, [
    { property: '排序', direction: 'ascending' },
  ]);
  return results.map((page: any) => {
    const p = page.properties;
    return {
      id: page.id,
      name: getRichText(p['照片名称']?.title),
      photoUrl: getFileUrl(p['照片']?.files),
      size: getSelect(p['尺寸']?.select),
      orientation: getSelect(p['方向']?.select),
      order: getNumber(p['排序']?.number),
    };
  });
}

// ===== 简历信息 =====
export async function getProfile(): Promise<ProfileItem[]> {
  const results = await queryDatabase(DATABASE_IDS.profile, [
    { property: '排序', direction: 'ascending' },
  ]);
  return results.map((page: any) => {
    const p = page.properties;
    return {
      id: page.id,
      title: getRichText(p['标题']?.title),
      type: getSelect(p['类型']?.select),
      content: getRichText(p['内容']?.rich_text),
      icon: getRichText(p['图标']?.rich_text),
      order: getNumber(p['排序']?.number),
    };
  });
}
