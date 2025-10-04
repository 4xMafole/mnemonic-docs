import { Document } from './types';
import { specificationContent } from './specificationContent';
import { architectureContent } from './architectureContent';
import { securityContent } from './securityContent';

export const documents: Document[] = [
  {
    key: 'spec',
    title: 'Mnemonic Computing Specification v0.1',
    shortTitle: 'Specification',
    content: specificationContent,
  },
  {
    key: 'arch',
    title: 'Mnemonic Computing: Technical Architecture & Implementation Plan',
    shortTitle: 'Architecture',
    content: architectureContent,
  },
  {
    key: 'sec',
    title: 'Security & Permissions Model for Mnemonic Computing',
    shortTitle: 'Security Model',
    content: securityContent,
  },
];
