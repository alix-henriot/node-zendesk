import path from 'node:path';
import dotenv from 'dotenv';
import {describe, expect, it, beforeAll} from 'vitest';
import {back as nockBack} from 'nock';
import {setupClient} from './setup.js';

dotenv.config();

describe('Zendesk Client Tickets - Merge', () => {
  const client = setupClient();

  beforeAll(async () => {
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, '/fixtures');
  });

  it('should successfully merge multiple tickets into a target ticket with comments', async () => {
    const {nockDone} = await nockBack('tickets_merge_with_comments.json');
    
    const targetTicketId = 123;
    const mergeData = {
      ids: [456, 789],
      target_comment: 'Merging tickets 456 and 789 into this ticket',
      source_comment: 'This ticket has been merged',
      target_comment_is_public: false,
      source_comment_is_public: false,
    };

    const {result: mergedTicket} = await client.tickets.merge(targetTicketId, mergeData);
    
    expect(mergedTicket).toBeDefined();
    expect(mergedTicket.id).toBeDefined();
    expect(typeof mergedTicket.id).toBe('number');
    
    nockDone();
  });

  it('should successfully merge multiple tickets with only required ids parameter', async () => {
    const {nockDone} = await nockBack('tickets_merge_minimal.json');
    
    const targetTicketId = 111;
    const mergeData = {
      ids: [222, 333],
    };

    const {result: mergedTicket} = await client.tickets.merge(targetTicketId, mergeData);
    
    expect(mergedTicket).toBeDefined();
    expect(mergedTicket.id).toBeDefined();
    
    nockDone();
  });

  it('should successfully merge tickets with only target comment', async () => {
    const {nockDone} = await nockBack('tickets_merge_target_comment_only.json');
    
    const targetTicketId = 100;
    const mergeData = {
      ids: [200],
      target_comment: 'These tickets were merged',
    };

    const {result: mergedTicket} = await client.tickets.merge(targetTicketId, mergeData);
    
    expect(mergedTicket).toBeDefined();
    expect(mergedTicket.id).toBeDefined();
    
    nockDone();
  });

  it('should successfully merge tickets with public comments', async () => {
    const {nockDone} = await nockBack('tickets_merge_public_comments.json');
    
    const targetTicketId = 50;
    const mergeData = {
      ids: [60, 70],
      target_comment: 'Public merge notification',
      source_comment: 'This ticket was merged',
      target_comment_is_public: true,
      source_comment_is_public: true,
    };

    const {result: mergedTicket} = await client.tickets.merge(targetTicketId, mergeData);
    
    expect(mergedTicket).toBeDefined();
    expect(mergedTicket.id).toBeDefined();
    
    nockDone();
  });
});
