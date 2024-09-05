import React, { ReactNode } from "react";

import BoxLogo from "../assets/logos/box.svg";
import ConfluenceLogo from "../assets/logos/confluence.svg";
import DropboxLogo from "../assets/logos/dropbox.svg";
import FreshdeskLogo from "../assets/logos/freshdesk.svg";
import GmailLogo from "../assets/logos/gmail.svg";
import GoogleDriveLogo from "../assets/logos/google_drive.svg";
import IntercomLogo from "../assets/logos/intercom.svg";
import NotionLogo from "../assets/logos/notion.svg";
import OneDriveLogo from "../assets/logos/onedrive.svg";
import OutlookLogo from "../assets/logos/outlook.svg";
import S3Logo from "../assets/logos/s3.svg";
import SharePointLogo from "../assets/logos/sharepoint.svg";
import FileUploadIcon from "../assets/logos/file_upload.svg";
import WebScraperIcon from "../assets/logos/web_scraper.svg";
// import SlackLogo from '../assets/logos/slack.svg';
import ZendeskLogo from "../assets/logos/zendesk.svg";
import ZoteroLogo from "../assets/logos/zotero.svg";
import GitbookLogo from "../assets/logos/gitbook.svg";
import GithubLogo from "../assets/logos/github.svg";
import SalesforceLogo from "../assets/logos/salesforce.svg";
import SlackLogo from "../assets/logos/slack.svg";
import GCSLogo from "../assets/logos/gcs-logo.svg";
import GuruLogo from "../assets/logos/guru-logo.svg";
import ServiceNowLogo from "../assets/logos/servicenow-logo.svg";
import { IntegrationName } from "../typing/shared";

export interface IntegrationItemType {
  id: IntegrationName;
  subpath: string;
  name: string;
  description: string;
  announcementName: string;
  icon: ReactNode;
  iconBgColor?: string;
  logo: any;
  active: boolean;
  data_source_type: IntegrationName;
  requiresOAuth: boolean;
  multiStep?: boolean;
  integrationsListViewTitle?: string;
  additionalInfo?: string;
  online?: boolean;
}

export const INTEGRATIONS_LIST: IntegrationItemType[] = [
  {
    id: IntegrationName.CONFLUENCE,
    subpath: "confluence",
    name: "Confluence",
    description: "Lets your users connect their Confluence accounts to Carbon.",
    announcementName: "to connect Confluence",
    icon: <img src={ConfluenceLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: ConfluenceLogo,
    active: true,
    data_source_type: IntegrationName.CONFLUENCE,
    requiresOAuth: true,
    multiStep: true,
    online: true,
  },
  {
    id: IntegrationName.LOCAL_FILES,
    subpath: "local",
    name: "Upload Files",
    description: "Lets your users upload local files to Carbon.",
    announcementName: "to upload local files",
    icon: <img src={FileUploadIcon} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: FileUploadIcon,
    active: true,
    data_source_type: IntegrationName.LOCAL_FILES,
    requiresOAuth: false,
  },
  {
    id: IntegrationName.WEB_SCRAPER,
    subpath: "scraper",
    name: "Web Scraper",
    description: "Lets your users Scrape websites to Carbon.",
    announcementName: "for Web Scraping",
    icon: <img src={WebScraperIcon} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: WebScraperIcon,
    active: true,
    data_source_type: IntegrationName.WEB_SCRAPER,
    requiresOAuth: false,
  },
  {
    id: IntegrationName.GITHUB,
    subpath: "github",
    name: "Github",
    description: "Lets your users connect their Gitbook accounts to Carbon.",
    announcementName: "to connect Gitbook",
    icon: <img src={GithubLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: GithubLogo,
    active: true,
    data_source_type: IntegrationName.GITHUB,
    requiresOAuth: false,
    multiStep: true,
    online: false,
  },
  {
    id: IntegrationName.DROPBOX,
    subpath: "dropbox",
    name: "Dropbox",
    description: "Lets your users connect their Dropbox accounts to Carbon.",
    announcementName: "to connect Dropbox",
    icon: <img src={DropboxLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: DropboxLogo,
    active: true,
    data_source_type: IntegrationName.DROPBOX,
    requiresOAuth: true,
  },
  {
    id: IntegrationName.GOOGLE_DRIVE,
    subpath: "google",
    name: "Google Drive",
    description: "Lets your users connect their Google Drive to Carbon.",
    announcementName: "to connect Google Drive",
    icon: <img src={GoogleDriveLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: GoogleDriveLogo,
    active: true,
    data_source_type: IntegrationName.GOOGLE_DRIVE,
    requiresOAuth: true,
    integrationsListViewTitle: "Google Drive",
  },
  {
    id: IntegrationName.GOOGLE_CLOUD_STORAGE,
    subpath: "gcs",
    name: "Google Cloud Storage",
    description:
      "Lets your users connect their Google Cloud Storage to Carbon.",
    announcementName: "to connect Google Cloud Storage",
    icon: <img src={GCSLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: GCSLogo,
    active: true,
    data_source_type: IntegrationName.GOOGLE_CLOUD_STORAGE,
    requiresOAuth: true,
    integrationsListViewTitle: "Google Cloud Storage",
  },
  {
    id: IntegrationName.GURU,
    subpath: "guru",
    name: "Guru",
    description: "Lets your users connect their Guru account to Carbon.",
    announcementName: "to connect Guru",
    icon: <img src={GuruLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: GuruLogo,
    active: true,
    data_source_type: IntegrationName.GURU,
    requiresOAuth: true,
    integrationsListViewTitle: "Guru",
  },
  {
    id: IntegrationName.NOTION,
    subpath: "notion",
    name: "Notion",
    description: "Lets your users connect their Notion accounts to Carbon.",
    announcementName: "to connect Notion",
    icon: <img src={NotionLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: NotionLogo,
    active: true,
    data_source_type: IntegrationName.NOTION,
    requiresOAuth: true,
  },
  {
    id: IntegrationName.SALESFORCE,
    subpath: "salesforce",
    name: "Salesforce",
    description: "Lets your users connect their Salesforce accounts to Carbon.",
    announcementName: "to connect Salesforce",
    icon: <img src={SalesforceLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: SalesforceLogo,
    active: true,
    data_source_type: IntegrationName.SALESFORCE,
    requiresOAuth: true,
    multiStep: true,
  },
  {
    id: IntegrationName.ZENDESK,
    subpath: "zendesk",
    name: "Zendesk",
    description: "Lets your users connect their Zendesk accounts to Carbon.",
    announcementName: "to connect Zendesk",
    icon: <img src={ZendeskLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: ZendeskLogo,
    active: true,
    data_source_type: IntegrationName.ZENDESK,
    requiresOAuth: true,
    multiStep: true,
  },
  {
    id: IntegrationName.ONEDRIVE,
    subpath: "onedrive",
    name: "OneDrive",
    description: "Lets your users connect their OneDrive accounts to Carbon.",
    announcementName: "to connect OneDrive",
    icon: <img src={OneDriveLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: OneDriveLogo,
    active: true,
    data_source_type: IntegrationName.ONEDRIVE,
    requiresOAuth: true,
  },
  {
    id: IntegrationName.S3,
    subpath: "s3",
    name: "S3",
    description: "Lets your users connect their data on S3 to Carbon.",
    announcementName: "to connect S3",
    icon: <img src={S3Logo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: S3Logo,
    active: true,
    data_source_type: IntegrationName.S3,
    requiresOAuth: false,
    multiStep: true,
  },
  {
    id: IntegrationName.SHAREPOINT,
    subpath: "sharepoint",
    name: "Sharepoint",
    description: "Lets your users connect their Sharepoint accounts to Carbon.",
    announcementName: "to connect Sharepoint",
    icon: <img src={SharePointLogo} className="cc-w-7 cc-h-7" />,
    logo: SharePointLogo,
    active: true,
    data_source_type: IntegrationName.SHAREPOINT,
    requiresOAuth: true,
    multiStep: true,
  },
  {
    id: IntegrationName.GMAIL,
    subpath: "gmail",
    name: "Gmail",
    description: "Lets your users connect their Gmail to Carbon.",
    announcementName: "to connect Gmail",
    icon: <img src={GmailLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: GmailLogo,
    active: true,
    data_source_type: IntegrationName.GMAIL,
    requiresOAuth: true,
    integrationsListViewTitle: "Gmail",
  },
  {
    id: IntegrationName.FRESHDESK,
    subpath: "freshdesk",
    name: "Freshdesk",
    description: "Lets your users connect their Freshdesk accounts to Carbon.",
    announcementName: "to connect Freshdesk",
    icon: <img src={FreshdeskLogo} className="cc-w-7 cc-h-7" />,
    logo: FreshdeskLogo,
    active: true,
    data_source_type: IntegrationName.FRESHDESK,
    requiresOAuth: true,
    multiStep: true,
  },
  {
    id: IntegrationName.BOX,
    subpath: "box",
    name: "Box",
    description: "Lets your users connect their Box accounts to Carbon.",
    announcementName: "to connect Box",
    icon: <img src={BoxLogo} className="cc-w-7 cc-h-7" alt="Box Logo" />,
    iconBgColor: "gray-50",
    logo: BoxLogo,
    active: true,
    data_source_type: IntegrationName.BOX,
    requiresOAuth: true,
  },
  {
    id: IntegrationName.GITBOOK,
    subpath: "gitbook",
    name: "Gitbook",
    description: "Lets your users connect their Gitbook accounts to Carbon.",
    announcementName: "to connect Gitbook",
    icon: <img src={GitbookLogo} className="cc-w-7 cc-h-7" />,
    logo: GitbookLogo,
    active: true,
    data_source_type: IntegrationName.GITBOOK,
    requiresOAuth: false,
    multiStep: true,
  },
  {
    id: IntegrationName.INTERCOM,
    subpath: "intercom",
    name: "Intercom",
    description: "Lets your users connect their Intercom to Carbon.",
    announcementName: "to connect Intercom",
    icon: <img src={IntercomLogo} className="cc-w-7 cc-h-7" />,
    iconBgColor: "gray-50",
    logo: IntercomLogo,
    active: true,
    data_source_type: IntegrationName.INTERCOM,
    requiresOAuth: true,
  },
  {
    id: IntegrationName.OUTLOOK,
    subpath: "outlook",
    name: "Outlook",
    description: "Lets your users connect their Outlook accounts to Carbon.",
    announcementName: "to connect Outlook",
    icon: <img src={OutlookLogo} className="cc-w-7 cc-h-7" />,
    logo: OutlookLogo,
    active: true,
    data_source_type: IntegrationName.OUTLOOK,
    requiresOAuth: true,
  },
  {
    id: IntegrationName.SERVICENOW,
    subpath: "servicenow",
    name: "ServiceNow",
    description: "Lets your users connect their ServiceNow accounts to Carbon.",
    announcementName: "to connect ServiceNow",
    icon: <img src={ServiceNowLogo} className="cc-w-7 cc-h-7" />,
    logo: ServiceNowLogo,
    active: true,
    data_source_type: IntegrationName.SERVICENOW,
    requiresOAuth: true,
    multiStep: true,
  },
  {
    id: IntegrationName.SLACK,
    subpath: "slack",
    name: "Slack",
    description: "Lets your users connect their Slack accounts to Carbon.",
    announcementName: "to connect Slack",
    icon: <img src={SlackLogo} className="cc-w-7 cc-h-7" />,
    logo: SlackLogo,
    active: true,
    data_source_type: IntegrationName.SLACK,
    requiresOAuth: true,
  },
  {
    id: IntegrationName.ZOTERO,
    subpath: "zotero",
    name: "Zotero",
    description: "Lets your users connect their Zotero accounts to Carbon.",
    announcementName: "to connect Zotero",
    icon: <img src={ZoteroLogo} className="cc-w-7 cc-h-7" />,
    logo: ZoteroLogo,
    active: true,
    data_source_type: IntegrationName.ZOTERO,
    requiresOAuth: true,
    multiStep: false,
  },
];
