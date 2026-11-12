import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { settingsRepository } from '@/database/repositories/settingsRepository';
import { auditRepository } from '@/database/repositories/auditRepository';
import { formatDate } from '@/utils/formatDate';
import { ShieldCheck, History, Save } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [st, logs] = await Promise.all([
        settingsRepository.getSettings(),
        auditRepository.getAll(),
      ]);
      setSettings(st);
      setAuditLogs(logs.slice(0, 10));
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsRepository.updateSettings('biz-apex', settings);
      toast.success('Kebijakan bisnis berhasil diperbarui!');
    } catch {
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) return null;

  return (
    <PageContainer>
      <PageHeader
        title="Pengaturan Bisnis & Audit Logs"
        description="Konfigurasi kebijakan keterlambatan denda sewa, uang jaminan deposit, dan riwayat aktivitas audit."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Kebijakan Rental & Denda
          </h3>
          <Input
            label="Persentase Denda Keterlambatan (% per Hari)"
            type="number"
            value={settings.late_fee_percentage}
            onChange={(e) => setSettings({ ...settings, late_fee_percentage: parseInt(e.target.value) || 0 })}
          />
          <Input
            label="Toleransi Waktu Pengembalian (Jam)"
            type="number"
            value={settings.grace_period_hours}
            onChange={(e) => setSettings({ ...settings, grace_period_hours: parseInt(e.target.value) || 0 })}
          />
          <Input
            label="Kebijakan Jaminan Deposit"
            value={settings.deposit_policy}
            onChange={(e) => setSettings({ ...settings, deposit_policy: e.target.value })}
          />
          <Input
            label="Kebijakan Pembatalan Sewa"
            value={settings.cancellation_policy}
            onChange={(e) => setSettings({ ...settings, cancellation_policy: e.target.value })}
          />
          <div className="pt-2 flex justify-end">
            <Button size="sm" icon={Save} isLoading={isSaving} type="submit">Simpan Kebijakan</Button>
          </div>
        </form>

        <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-primary" /> Riwayat Audit Aktivitas ({auditLogs.length})
            </h3>
            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-neutral-50 rounded-btn border border-neutral-100 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-neutral-400">
                    <span className="font-bold text-primary">{log.action}</span>
                    <span>{formatDate(log.createdAt, 'dd MMM, HH:mm')}</span>
                  </div>
                  <p className="text-neutral-700 mt-0.5">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
