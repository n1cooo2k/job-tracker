import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useApplications() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setError(null)
    const { data, error: err } = await supabase
      .from('job_applications')
      .select('*')
      .order('application_date', { ascending: false })
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setRows(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  /** Insert when id is null, update otherwise. Throws on failure. */
  const save = useCallback(
    async (values, id) => {
      if (id) {
        const { error: err } = await supabase.from('job_applications').update(values).eq('id', id)
        if (err) throw err
      } else {
        const { error: err } = await supabase
          .from('job_applications')
          .insert({ ...values, user_id: user.id })
        if (err) throw err
      }
      await refresh()
    },
    [user, refresh],
  )

  const remove = useCallback(async (id) => {
    const { error: err } = await supabase.from('job_applications').delete().eq('id', id)
    if (err) throw err
    setRows((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return { rows, loading, error, refresh, save, remove }
}
